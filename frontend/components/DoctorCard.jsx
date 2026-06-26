import {MapPin, Star} from "lucide-react";

const fallbackImage = "/doctor-placeholder.jpg";

function formatPrice(value) {
    if (!value) return "تماس بگیرید";

    return `${Number(value).toLocaleString("fa-IR")} تومان`;
}

export default function DoctorCard({doctor}) {
    const doctorName = doctor.user_full_name || doctor.name || "پزشک";
    const specialtyName = doctor.specialty_name || doctor.title || "تخصص نامشخص";
    const city = doctor.city || doctor.clinic_name || "تهران";
    const visitType = doctor.visit_type === "online" ? "آنلاین" : doctor.visit_type === "in_person" ? "حضوری" : "حضوری/آنلاین";

    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <img
                src={doctor.profile_picture || doctor.image || fallbackImage}
                alt={doctorName}
                className="h-[360px] w-full object-cover"
            />

            <div className="p-6">
                <h3 className="text-2xl font-bold">{doctorName}</h3>
                <p className="text-gray-500 mt-2">{specialtyName}</p>

                <div className="flex items-center gap-2 mt-4">
                    <Star className="fill-yellow-400 text-yellow-400" size={18}/>
                    <span>4.9</span>
                    <span className="text-gray-400">(120 نظر)</span>
                </div>

                <div className="mt-5 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#5E5CE6]"/>
                        <span>{city}</span>
                    </div>
                    <div>نوع ویزیت: {visitType}</div>
                    <div>هزینه مشاوره: {formatPrice(doctor.consultation_fee)}</div>
                    <div>سابقه: {doctor.experience_years || 0} سال</div>
                </div>

                <button className="w-full mt-6 rounded-xl bg-[#5E5CE6] text-white py-3 hover:bg-[#4d4ad9] transition">
                    درخواست نوبت آنلاین
                </button>

                <button className="w-full mt-4 text-[#5E5CE6] font-semibold">view profile →</button>
            </div>
        </div>
    );
}