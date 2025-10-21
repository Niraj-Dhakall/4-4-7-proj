"use client"
import React from "react";

const ProfileImage = ({ name } : {name: string}) => {
  const nameParts = name.split(" ");
  const firstNameInitial = nameParts[0] ? nameParts[0][0] : "";
  const lastNameInitial = nameParts[1] ? nameParts[1][0] : "";

  return (
    <span className="user-profile-image bg-yellow-500/90 text-black  text-xl font-semibold rounded-full w-[64px] h-[64px] text-center flex items-center justify-center">
      {firstNameInitial}
      {lastNameInitial}
    </span>
  );
};
export default ProfileImage;