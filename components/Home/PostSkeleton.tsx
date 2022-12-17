import { Skeleton } from "@mantine/core";

export default function PostSkeleton() {
 return (
  <div>
   <Skeleton circle height={24} mb="sm" />
   <Skeleton height={12} width={"40%"} radius="xl" mb="sm" />
   <Skeleton height={8} radius="xl" />
   <Skeleton height={8} mt={6} radius="xl" />
   <Skeleton height={8} mt={6} width="70%" radius="xl" />
  </div>
 );
}
