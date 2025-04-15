import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

export const Signup = () => {
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
            <Heading label={"Signup"} />
            <SubHeading label={"Enter your information to create an account"} />
            <InputBox label={"First Name"} placeholder={"Arsalaan"} />
            <InputBox label={"Last Name"} placeholder={"Ahmad"} />
            <InputBox label={"Email"} placeholder={"arsal745@gmail.com"} />
            <InputBox label={"Password"} placeholder={"12345"} />
            <div className="pt-4">
            <Button label={"Signup"} />
            </div>
            <BottomWarning label={"Already have an account?"} buttonText={"Signin"} to={"/signin"} />
        </div>
      </div>
    </div>
  );
};
