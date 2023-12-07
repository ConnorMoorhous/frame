import CreatePost from "./CreatePost";
import ProfileLink from "./ProfileLink";
import Search from "./Search";

const SidebarItems = () => {
	return (
		<>
			<Search />
			<CreatePost />
			<ProfileLink />
		</>
	);
};

export default SidebarItems;
