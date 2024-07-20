import React from 'react';
import { Nav } from 'react-bootstrap';

const Sidebar = () => {
  return (
    <div className="bg-light border-right" id="sidebar-wrapper">
      <div className="sidebar-heading">إدارة المدرسة</div>
      <Nav className="flex-column">
        <Nav.Link href="/dashboard">الرئيسية</Nav.Link>
        <Nav.Link href="/branches">الفروع</Nav.Link>
        <Nav.Link href="/stages">المراحل التعليمية</Nav.Link>
        <Nav.Link href="/teachers">المعلمون</Nav.Link>
        <Nav.Link href="/students">الطلاب</Nav.Link>
        <Nav.Link href="/attendance">الحضور</Nav.Link>
        <Nav.Link href="/parents">أولياء الأمور</Nav.Link>
      </Nav>
    </div>
  );
}

export default Sidebar;
