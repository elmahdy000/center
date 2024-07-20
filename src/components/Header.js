import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const Header = () => {
  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Navbar.Brand href="/">لوحة القيادة</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/dashboard">الرئيسية</Nav.Link>
          <Nav.Link href="/branches">الفروع</Nav.Link>
          <Nav.Link href="/stages">المراحل التعليمية</Nav.Link>
          <Nav.Link href="/teachers">المعلمون</Nav.Link>
          <Nav.Link href="/students">الطلاب</Nav.Link>
          <Nav.Link href="/attendance">الحضور</Nav.Link>
          <Nav.Link href="/parents">أولياء الأمور</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
