import { useLoginController } from "@/components/LoginComponent/LoginComponent.controller";

export const useLogoutButton = () => {
    const { logout } = useLoginController();
    return { logout };
};
