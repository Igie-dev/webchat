import { Input } from "@/components/ui/input";
import UsersCard from "./UsersCard";
import { useGetUsersQuery } from "@/service/slices/user/userApiSlice";
import LoadingSkeleton from "./LoadingSkeleton";
import { useAppSelector } from "@/service/store";
import { getCurrentUser } from "@/service/slices/user/userSlice";
export default function UsersList() {
	const { user_id } = useAppSelector(getCurrentUser);
	const { data, isFetching } = useGetUsersQuery(0);

	return (
		<div className="flex flex-col w-full h-[85%] gap-2">
			<header className="flex items-center w-full gap-4 h-[8%] px-4 rounded-sm">
				<h1 className="text-sm font-semibold">Users</h1>
				<Input
					type="text"
					placeholder="Search..."
					className="bg-secondary/70"
				/>
			</header>
			<ul className="flex flex-col w-full h-[92%] overflow-y-auto p-2">
				{isFetching ? (
					<LoadingSkeleton />
				) : data?.users?.length > 0 ? (
					data?.users
						?.filter((u: TUser) => u.user_id !== user_id)
						.map((user: TUser) => {
							return <UsersCard key={user.user_id} user={user} />;
						})
				) : (
					<p>Empty</p>
				)}
			</ul>
		</div>
	);
}
