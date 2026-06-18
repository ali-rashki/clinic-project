from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from django.utils.decorators import method_decorator
from django_ratelimit.decorators import ratelimit
from .serializers import RegisterSerializer, UserSerializer
from specialties.models import DoctorProfile


class RegisterView(generics.CreateAPIView):
    """ثبت‌نام کاربر جدید"""
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    # FIX 5: Rate limit - حداکثر 5 ثبت‌نام در دقیقه از یک IP
    @method_decorator(ratelimit(key='ip', rate='5/m', method='POST', block=True))
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "ثبت‌نام با موفقیت انجام شد.",
                "user": UserSerializer(user).data,
                "tokens": {
                    "access": str(refresh.access_token),
                    "refresh": str(refresh),
                }
            },
            status=status.HTTP_201_CREATED
        )


class LoginView(TokenObtainPairView):
    """ورود و دریافت توکن JWT"""
    permission_classes = [permissions.AllowAny]

    # FIX 5: Rate limit - حداکثر 10 تلاش لاگین در دقیقه از یک IP
    @method_decorator(ratelimit(key='ip', rate='10/m', method='POST', block=True))
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == status.HTTP_200_OK:
            try:
                user = self._get_user(request)
                if user:
                    if getattr(user, 'role', None) == 'doctor':
                        DoctorProfile.objects.get_or_create(user=user)
                    doctor_profile = DoctorProfile.objects.filter(user=user).first()
                    doctor_verified = bool(
                        doctor_profile and (doctor_profile.is_verified or doctor_profile.is_approved)
                    )
                    response.data['user'] = UserSerializer(user).data
                    response.data['role'] = getattr(user, 'role', 'patient')
                    response.data['doctor_profile_exists'] = doctor_profile is not None
                    response.data['doctor_verified'] = doctor_verified

                    if getattr(user, 'role', None) == 'doctor':
                        response.data['redirect_to'] = '/doctor/dashboard' if doctor_verified else '/doctor/pending'
                    else:
                        response.data['redirect_to'] = '/'
            except Exception:
                pass

        return response

    def _get_user(self, request):
        from django.contrib.auth import get_user_model
        User = get_user_model()
        username = request.data.get('username')
        if not username:
            return None
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            try:
                return User.objects.get(email=username)
            except User.DoesNotExist:
                return None


class LogoutView(APIView):
    """
    FIX 3: خروج درست با blacklist کردن Refresh Token
    بعد از logout، توکن دیگه قابل استفاده نیست
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response(
                {"error": "refresh token الزامی است."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "با موفقیت خارج شدید."}, status=status.HTTP_200_OK)
        except TokenError:
            return Response(
                {"error": "توکن نامعتبر یا منقضی شده است."},
                status=status.HTTP_400_BAD_REQUEST
            )


class ProfileView(generics.RetrieveUpdateAPIView):
    """مشاهده و ویرایش پروفایل کاربر لاگین شده"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user
