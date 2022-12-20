import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import Container from "./Container";
const Header = dynamic(() => import("./Home/Header"), {
 ssr: false,
});

export interface LayoutProps {
 children: JSX.Element;

 /**
  * Routes to exclude from the layout
  */
 excludedRoutes: string[];
}

export default function Layout({ children, excludedRoutes }: LayoutProps) {
 const router = useRouter();

 if (excludedRoutes.includes(router.pathname)) {
  return children;
 }

 return (
  <>
   <Header />
   <Container
    marginBlock={25}
    size="70vw"
    excludedRoutes={["/account/activate"]}
   >
    {children}
   </Container>
  </>
 );
}
