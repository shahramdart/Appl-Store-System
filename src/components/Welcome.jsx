import React from "react";
import { useSelector } from "react-redux";
import GridView from "./GridView";
import Logo from "../assets/CodeCrafted.png";

const Welcome = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="py-4">
      <GridView />
      <div className="flex flex-row justify-center items-center">
        <img
          src={Logo}
          className="mt-10 object-cover lg:max-w-[500px] opacity-30"
          alt=""
        />
      </div>
    </div>
  );
};

export default Welcome;
