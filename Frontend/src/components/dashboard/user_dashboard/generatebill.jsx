import { jsPDF } from "jspdf";
import "jspdf-autotable";
import logo from "../../../assets/images/logo1.jpg";
import { useContext } from "react";
import {useAuthContext} from "../../../context/AuthContext";

// Function to generate a unique bill ID
const generateBillId = () => {
  return `BILL-${Date.now().toString().slice(-6)}`;
};

export const generatePDF = (orderDetail,user) => {
  console.log(user);
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [80, 150],
  });

  doc.setFont("courier", "normal");

  const timestamp = new Date(new Date(orderDetail.createdAt).getTime() + 330*60*1000).toISOString();
  const [formattedDate, rawTime] = timestamp.split("T");
  const formattedTime = rawTime.replace("Z", "");

  const billId = generateBillId();
  let yPos = 2;
  const leftMargin = 5;
  const centerX = 40;

  // Logo
  doc.addImage(logo, 'JPG', 30, yPos, 20, 10);
  yPos += 17;

  // Header
  doc.setFontSize(12);
  doc.setFont("courier", "bold");
  doc.text("KOE - THE - CAFE", centerX, yPos, { align: "center" });
  yPos += 5;

  doc.setFontSize(8);
  doc.setFont("courier", "normal");
  doc.text("123 Cafe Street, Foodie Lane", centerX, yPos, { align: "center" });
  yPos += 4;
  doc.text("Gourmet City, 123456", centerX, yPos, { align: "center" });
  yPos += 4;
  doc.text("Tel: +91 9876543210", centerX, yPos, { align: "center" });
  yPos += 6;

  doc.setLineWidth(0.3);
  doc.line(leftMargin, yPos, 75, yPos);
  yPos += 6;

  // Bill details
  doc.setFontSize(8);
  doc.text(`Bill #: ${billId}`, leftMargin, yPos);
  yPos += 4;
  doc.text(`Name: ${user.fullname}`, leftMargin, yPos);
  yPos += 4;
  doc.text(`emailId: ${user.username}`, leftMargin, yPos);
  yPos += 4;
  doc.text(`Order ID: ${orderDetail._id.slice(-8)}`, leftMargin, yPos);
  yPos += 4;
  doc.text(`Date: ${formattedDate}`, leftMargin, yPos);
  yPos += 4;
  doc.text(`Time: ${formattedTime}`, leftMargin, yPos);
  yPos += 4;
  doc.text(`paymentId:${orderDetail.paymentId || Math.floor(Math.random()*100000000)}`, leftMargin, yPos);
  yPos += 4;
  doc.text(`Server: Staff`, leftMargin, yPos);
  yPos += 4;
  doc.text(`Table: Dine-In`, leftMargin, yPos);
  yPos += 6;

  doc.setLineWidth(0.3);
  doc.line(leftMargin, yPos, 75, yPos);
  yPos += 6;

  // Table header
  doc.setFont("courier", "bold");
  doc.text("ITEM", leftMargin, yPos);
  doc.text("QTY", 32, yPos);
  doc.text("PRICE", 44, yPos);
  doc.text("AMT", 66, yPos, { align: "right" });
  yPos += 8;

  doc.setLineWidth(0.1);
  doc.line(leftMargin, yPos, 75, yPos);
  yPos += 4;

  // Items
  doc.setFont("courier", "normal");
  doc.setFontSize(7);
  let subtotal = 0;

  orderDetail.orders.forEach((item) => {
    const dishName = item.dish.dishName;
    const truncatedName = dishName.length > 18 ? dishName.substring(0, 16) + ".." : dishName;
    const quantity = item.quantity;
    const price = item.dish.price;
    const total = quantity * price;
    subtotal += total;

    doc.text(truncatedName, leftMargin, yPos);
    doc.text(quantity.toString(), 32, yPos);
    doc.text(`Rs. ${price}`, 41, yPos);
    doc.text(`Rs. ${total}`, 70, yPos, { align: "right" });
    yPos += 4;
  });

  doc.setLineWidth(0.1);
  doc.line(leftMargin, yPos, 75, yPos);
  yPos += 6;

  // Totals
  doc.setFontSize(8);
  doc.text("Subtotal:", 40, yPos);
  doc.text(`Rs. ${subtotal}`, 70, yPos, { align: "right" });
  yPos += 4;

  const taxRate = 0.05;
  const taxAmount = Math.round(subtotal * taxRate);
  doc.text("GST (5%):", 40, yPos);
  doc.text(`Rs. ${taxAmount}`, 70, yPos, { align: "right" });
  yPos += 4;

  doc.setFont("courier", "bold");
  doc.text("TOTAL:", 44, yPos);
  doc.text(`Rs. ${orderDetail.totalAmount+taxAmount}`, 70, yPos, { align: "right" });
  yPos += 6;

  doc.setFont("courier", "normal");
  doc.text("Payment Method: Prepaid", leftMargin, yPos);
  yPos += 8;

  doc.setFont("courier", "bold");
  doc.text("Thank you for dining with us!", centerX, yPos, { align: "center" });
  yPos += 4;
  doc.setFont("courier", "normal");
  doc.text("Please visit again!", centerX, yPos, { align: "center" });
  yPos += 6;

  // Footer
  doc.setFontSize(6);
  doc.text("This is a computer generated bill", centerX, yPos, { align: "center" });
  yPos += 3;
  doc.text(`Generated on: ${formattedDate} at ${formattedTime}`, centerX, yPos, { align: "center" });

  const fileName = `KOE_Cafe_Bill_${billId}.pdf`;
  doc.save(fileName);

  return fileName;
};

export const handleGenerateBill = (orderDetail) => {
  const lastGenerated = localStorage.getItem(`bill_${orderDetail._id}`);
  const now = Date.now();

  if (lastGenerated && now - Number.parseInt(lastGenerated) < 10000) {
    if (confirm("You recently downloaded this bill. Download again?")) {
      generatePDF(orderDetail);
      localStorage.setItem(`bill_${orderDetail._id}`, now.toString());
    }
  } else {
    generatePDF(orderDetail);
    localStorage.setItem(`bill_${orderDetail._id}`, now.toString());
  }
};
