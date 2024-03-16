import { FormEvent, useEffect, useRef, useState } from "react";
import BtnLoader from "@/components/loader/BtnLoader";
import { useNavigate } from "react-router-dom";
import ResendOtp from "./ResendOtp";
import { Button } from "@/components/ui/button";
import { useRegisterMutation } from "@/service/slices/auth/authApiSlice";
import { useSearchParams } from "react-router-dom";
import { decryptText } from "@/lib/helper";
import { Input } from "@/components/ui/input";
export default function VerifyOtp() {
	const [register, { isLoading, isError, error }] = useRegisterMutation();
	const inputRef = useRef<HTMLInputElement | null>(null);
	const [inputOtp, setInputOtp] = useState("");
	const navigate = useNavigate();
	const [search] = useSearchParams();
	const first_name = search.get("firstName");
	const last_name = search.get("lastName");
	const email = search.get("email");
	const password = decryptText(decodeURIComponent(search.get("password")!));

	useEffect(() => {
		if (!first_name || !last_name || !email || !password) {
			navigate("/register/form");
		}
	}, [email, first_name, last_name, navigate, password]);

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!first_name || !last_name || !email || !password) {
			return;
		}
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const res: any = await register({
				otp: inputOtp,
				first_name,
				last_name,
				email,
				password,
			});
			console.log(res);
			if (res?.data?.email) {
				navigate("/login");
			}
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		inputRef?.current?.focus();
	}, []);
	return (
		<form
			onSubmit={handleSubmit}
			className="w-full max-w-[30rem] flex flex-col gap-5">
			<header className="flex flex-col items-center w-full">
				<div className="text-lg font-semibold lg:text-3xl">
					<p>Email Verification</p>
				</div>
				<div className="flex flex-col items-center my-5 text-xs text-gray-400 lg:text-sm">
					<p className="font-normal">We have sent a code to your email</p>
					<p className="p-2 my-4 font-medium rounded-md bg-secondary">
						{email}
					</p>
				</div>
				{isError ? (
					<p className="text-sm text-destructive">{error?.data?.message}</p>
				) : null}
			</header>
			<main className="flex flex-col items-center w-full gap-8">
				<Input
					ref={inputRef}
					type="text"
					placeholder="Enter your Otp"
					value={inputOtp || ""}
					onChange={(e) => setInputOtp(e.target.value)}
					className="w-[14rem] h-12 outline-none pl-2 pr-10 text-center  text-sm  rounded-lg  border-2 bg-secondary focus:border-primary/70"
				/>
				<ResendOtp email={email as string} />
				<Button
					type="submit"
					title="Subit Otp"
					disabled={isLoading}
					className="w-[80%] h-10  rounded-md">
					{isLoading ? <BtnLoader /> : "Submit"}
				</Button>
			</main>
		</form>
	);
}
