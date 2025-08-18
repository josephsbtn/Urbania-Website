import { Smile, Sun, Wind } from "lucide-react";

export default function StatusCards() {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      <div className="bg-white p-4 rounded-2xl shadow-md text-center">
        <h3 className="font-bold">Air Quality</h3>
        <p className="text-2xl text-blue-600">62</p>
        <p className="text-gray-500">Moderate</p>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-md text-center">
        <Smile className="mx-auto text-green-500" />
        <p className="text-xl font-bold">82</p>
        <p className="text-gray-500">Happiness Index</p>
      </div>
      <div className="bg-white p-4 rounded-2xl shadow-md text-center">
        <Sun className="mx-auto text-yellow-500 mt-2" />
        <p className="text-xl font-bold">7</p>
        <p className="text-gray-500">UV Index</p>
      </div>
    </div>
  );
}
