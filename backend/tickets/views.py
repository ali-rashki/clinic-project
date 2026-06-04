from rest_framework import generics, permissions
from .models import SupportTicket
from .serializers import SupportTicketSerializer


class TicketCreateView(generics.CreateAPIView):
    """ایجاد تیکت پشتیبانی جدید"""
    serializer_class = SupportTicketSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)