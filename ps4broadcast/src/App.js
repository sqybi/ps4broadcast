import { Layout } from "antd";
import React from "react";
import './App.css';
import Header from './Layouts/Header';
import Content from './Layouts/Content';
import Footer from "./Layouts/Footer";

function App() {
  return (
    <div className="App">
      <Layout>
        <Layout.Header style={{position: "fixed", zIndex: 1, width: "100%"}}>
          <Header />
        </Layout.Header>
        <Layout>
          <Content />
        </Layout>
        <Layout.Footer>
          <Footer />
        </Layout.Footer>
      </Layout>
    </div>
  );
}

export default App;
