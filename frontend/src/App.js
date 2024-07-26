import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Provider from "./context/userContext/Provider";
import Chat from "./components/Chat";
import DocumentDetails from "./components/documents/DocumentDetails";

function App() {
  return (
    <>
      <Provider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Signup />} />
            <Route path="/chat" element={<Chat />} />
            <Route
              path="/documents/:documentId"
              element={<DocumentDetails />}
            />
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
