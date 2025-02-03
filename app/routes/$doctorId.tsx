import type {Route} from "./+types/$doctorId";

export function meta({params, data}: Route.MetaArgs) {
    const {doctorId} = params;
    const {doctor, specialities} = data.data

    const name = `${doctor.title} ${doctor.firstname} ${doctor.lastname}`;
    const description = `Meet ${name} from ${doctor.city}. Specialities: ${specialities.join(", ")}`;

    return [
        {title: `${name} - Amrutam`},
        {
            name: "description",
            content: description
        },
        {name: "image", content: doctor.photo},
        {name: "robots", content: "index, follow"},
        {name: "author", content: "Amrutam"},
        {name: 'keywords', content: specialities.join(", ")},
        {property: "og:title", content: name},
        {property: "og:description", content: description},
        {property: "og:image", content: doctor.photo},
        {property: "og:url", content: `https://amrutam.global/doctor/${doctorId}`},
        {property: "og:type", content: "profile"},
        {property: "profile:first_name", content: doctor.firstname},
        {property: "profile:last_name", content: doctor.lastname},
        {property: "profile:username", content: `${doctor.firstname} ${doctor.lastname}`},
    ] as Route.MetaDescriptors;
}

const backendUrl = "https://stagingapp.amrutam.global/api/v1/patient/doctors/profile/"

export async function loader({params}: Route.LoaderArgs) {
    const {doctorId} = params;
    const url = `/api/doctor/${doctorId}`;
    console.log("url", url)
    const response = await fetch(`${backendUrl}${doctorId}`);

    if (!response.ok) {
        throw new Error("Failed to load doctor data");
    }

    return await response.json() as {
        success: boolean;
        data: {
            doctor: {
                title: string;
                firstname: string;
                lastname: string;
                photo: string;
                city: string;
            }
            specialities: string[];
        };
    };
}

export default function DoctorPage({params, loaderData}: Route.ComponentProps) {
    const {doctorId} = params
    const {doctor, specialities} = loaderData.data
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl text-gray-600 font-bold mb-2">{doctor.firstname} {doctor.lastname}</h1>
            <img className="w-32 h-32 rounded-full mb-4" src={doctor.photo}
                 alt={`Photo of ${doctor.firstname} ${doctor.lastname}`}/>
            <p className="text-gray-600 mb-1">{doctor.city}</p>
            <p className="text-gray-600 mb-4">{doctor.title}</p>
            <ul className="list-disc list-inside">
                {specialities.map(speciality => (
                    <li key={speciality} className="text-gray-700">{speciality}</li>
                ))}
            </ul>
        </div>
    );
}

