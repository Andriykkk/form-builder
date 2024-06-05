import { useContext } from "react";
import { UserContext } from "@clerk/nextjs"; // Import UserContext from Clerk
import { currentUser } from "@clerk/nextjs/server";

export async function useUserStatus() {
  try {
    const user = await currentUser();
    return !!user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return false;
  }
}
