import Footer from "../login/components/footer";
import NavBar from "../login/components/navbar";
import ProtectedRoute from "../login/components/protected-route";
import DocumentsPage from "./_components/DocumentsPage";

export default function page() {
  return (
    <ProtectedRoute>
      <NavBar />
      <DocumentsPage />
      <Footer />
    </ProtectedRoute>
  );
}
