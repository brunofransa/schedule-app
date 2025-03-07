import { useState } from "react";
import { format, parse, isSameDay } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function ScheduleApp() {
  const [courseName, setCourseName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [lessonCount, setLessonCount] = useState("");
  const [holidays, setHolidays] = useState("");
  const [selectedDays, setSelectedDays] = useState([]);
  const [lessonDuration, setLessonDuration] = useState("");
  const [schedule, setSchedule] = useState([]);

  const weekdays = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"];

  const toggleDaySelection = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const generateSchedule = () => {
    if (!startDate || !lessonCount || selectedDays.length === 0 || !lessonDuration) {
      alert("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    const start = new Date(startDate);
    const holidaysList = holidays.split(",").map((h) => parse(h.trim(), "dd-MM-yyyy", new Date())).filter(Boolean);
    
    let lessons = [];
    let currentDate = start;
    let count = 0;
    
    while (count < Number(lessonCount)) {
      if (
        selectedDays.includes(weekdays[currentDate.getDay()]) &&
        !holidaysList.some((h) => isSameDay(h, currentDate))
      ) {
        lessons.push({
          number: count + 1,
          date: format(currentDate, "dd-MM-yyyy"),
          weekday: weekdays[currentDate.getDay()],
          duration: Number(lessonDuration)
        });
        count++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setSchedule(lessons);
  };

  const exportToTxt = () => {
    let totalHours = schedule.reduce((acc, lesson) => acc + lesson.duration, 0);
    let content = `Planejador de Calendário - Programa Florescendo Talentos\n`;
    content += `Curso: ${courseName}\n`;
    content += `Total de Horas: ${totalHours}\n\n`;
    schedule.forEach((lesson) => {
      content += `Aula ${lesson.number.toString().padStart(2, '0')} - ${lesson.date} - ${lesson.weekday} - ${lesson.duration} horas\n`;
    });
    
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "cronograma.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 max-w-lg mx-auto bg-[#F7F6E2] text-[#232323] border-2 border-[#4AE23D] font-barlow">
      <h1 className="text-xl font-bold mb-4 text-[#0C2856]">Planejador de Calendário - Programa Florescendo Talentos</h1>
      <Input className="border-2 border-[#4AE23D] focus:border-[#FF6002]" placeholder="Nome do Curso" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
      <Input className="border-2 border-[#4AE23D] focus:border-[#FF6002] mt-2" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <Input className="border-2 border-[#4AE23D] focus:border-[#FF6002] mt-2" type="number" placeholder="Número de Aulas" value={lessonCount} onChange={(e) => setLessonCount(e.target.value)} />
      <Input className="border-2 border-[#4AE23D] focus:border-[#FF6002] mt-2" placeholder="Feriados (separados por vírgula - dd-MM-yyyy)" value={holidays} onChange={(e) => setHolidays(e.target.value)} />
      <div className="mt-2">
        <p className="text-[#0C2856]">Selecione os Dias das Aulas:</p>
        {weekdays.map((day) => (
          <label key={day} className="flex items-center space-x-2">
            <Checkbox checked={selectedDays.includes(day)} onCheckedChange={() => toggleDaySelection(day)} />
            <span>{day}</span>
          </label>
        ))}
      </div>
      <Input className="border-2 border-[#4AE23D] focus:border-[#FF6002] mt-2" type="number" placeholder="Duração das Aulas (horas)" value={lessonDuration} onChange={(e) => setLessonDuration(e.target.value)} />
      <Button className="mt-4 bg-[#0C2856] text-white" onClick={generateSchedule}>Gerar Cronograma</Button>
      {schedule.length > 0 && (
        <Card className="mt-4 bg-[#FFCE00] text-[#232323] border-2 border-[#4AE23D]">
          <CardContent>
            <h2 className="text-lg font-bold text-[#0C2856]">{courseName}</h2>
            <p className="font-bold">Total de Horas: {schedule.reduce((acc, lesson) => acc + lesson.duration, 0)}</p>
            <ul>
              {schedule.map((lesson, index) => (
                <li key={index}>Aula {lesson.number.toString().padStart(2, '0')} - {lesson.date} - {lesson.weekday} - {lesson.duration} horas</li>
              ))}
            </ul>
            <Button className="mt-4 bg-[#0C2856] text-white" onClick={exportToTxt}>Baixar como TXT</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
