import React from "react";

export default function Cards() {
  const cards = [
    { title: "Total Adeudado", value: "$5,000.00" },
    { title: "Último Pago", value: "$1,500.00" },
    { title: "Próximo Vencimiento", value: "15 Nov 2025" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition"
        >
          <h2 className="text-gray-500 font-medium">{card.title}</h2>
          <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
        </div>
      ))}
    </div>
  );
}