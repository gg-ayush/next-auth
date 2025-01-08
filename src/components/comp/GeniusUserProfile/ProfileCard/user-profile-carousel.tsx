import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/src/ui/carousel";
import { UserProfile } from "./user-profile";

export function UserProfilesCarousel({
  users,
  toggleModal,
  isUserLoggedIn,
}: {
  users: Array<any>;
  toggleModal: () => void;
  isUserLoggedIn: boolean;
}) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {users.map((user) => (
          <CarouselItem key={user.username} className="md:basis-1/2">
            <div className="p-1">
              <UserProfile
                username={user.username}
                name={user.firstName}
                role={user.role}
                avatarUrl={user.image}
                isUserLoggedIn={isUserLoggedIn}
                toggleModal={toggleModal}
              />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="bg-black text-white dark:text-black border-none hover:bg-white dark:bg-white dark:hover:bg-black" />
      <CarouselNext className="bg-black text-white dark:text-black border-none hover:bg-white dark:bg-white dark:hover:bg-black" />
    </Carousel>
  );
}
