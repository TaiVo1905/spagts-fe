import React from "react";

const teachers = [
  {
    backgroundImage:
      "https://i.pinimg.com/736x/36/b0/23/36b023762ab3337d3eba0d0c253785f9.jpg",
    avatar:
      "https://i.pinimg.com/736x/83/40/99/8340999014aee07ce2b7029bc98eb463.jpg",
    subject: "IT English",
    name: "Nguyễn Thị Thùy Trang",
    email: "TrangPNVenglish@gmail.com",
  },
];

const TeacherCard = ({ backgroundImage, avatar, subject, name, email }) => {
  return (
    <div
      className="flex rounded-xl overflow-hidden shadow-md"
      style={{ height: "261px" }}
    >
      <div
        className="bg-cover bg-center"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          width: "70%",
          height: "261px",
        }}
      ></div>
      <div
        className="bg-[#fef6f0] flex justify-center items-center p-4"
  style={{ width: "30%", height: "261px", backgroundColor: "#FFF5EB" }}
      >
        <img
          src={avatar}
          alt={name}
  style={{ width: "76px", height: "76px" }} 
className="rounded-full mr-4"

        />
        <div>
          <h2 className="text-lg font-semibold">{subject}</h2>
          <p className="text-base text-gray-800">{name}</p>
          <a
            href={`mailto:${email}`}
            className="text-sm text-blue-500 underline"
          >
            {email}
          </a>
        </div>
      </div>
    </div>
  );
};

const TeacherList = () => {
  return (
    <div className="p-6">
      {teachers.map((teacher, index) => (
        <TeacherCard
          key={index}
          backgroundImage={teacher.backgroundImage}
          avatar={teacher.avatar}
          subject={teacher.subject}
          name={teacher.name}
          email={teacher.email}
        />
      ))}
    </div>
  );
};

export default TeacherList;
