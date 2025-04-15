import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";

export const Signin = () => {
  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Signin"} />
          <SubHeading label={"Enter details to access your account"}/>
          <InputBox label={"Email"} placeholder={"arsal745@gmail.com"} />
          <InputBox label={"Password"} placeholder={"1234"} />
          <div className="pt-4">
            <Button label={"Signin"} />
          </div>
          <BottomWarning label={"Don't have an account?"} buttonText={"Signup"} to={"/signup"} />
        </div>
      </div>
    </div>
  );
};
