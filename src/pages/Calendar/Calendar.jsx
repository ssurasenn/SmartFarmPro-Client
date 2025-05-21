import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";

// Styles ของ shadcn ที่แปรงโค้ดให้ใช้ได้กับ react
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Dialog from "../../components/ui/Dialog";
import Label from "../../components/ui/Label";

//icon
import { MdDeleteForever } from "react-icons/md";

import { toast } from "react-toastify";
import EventManager from './EventManager';

const Calendar = () => {
  const [events, setEvents] = useState([]);

  const getRandomColor = () => {
    const colors = [
      "#8ef4b4",
      "#ffd166",
      "#bde0fe",
      "#ffb6b6",
      "#caffbf",
      "#d0bfff",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const [formData, setFormData] = useState({
    id: null,
    title: "",
    type: "",
    start: "",
    end: "",
    backgroundColor: "",
  });
  const typeColors = {
    meeting: "#60a5fa", // ฟ้า
    task: "#34d399", // เขียว
    personal: "#f472b6", // ชมพู
    other: "#c084fc", // ม่วง
  };
  //popup
  const [dialogOpen, setDialogOpen] = useState(false);

  const toInputDateTime = (isoString) => {
    return new Date(isoString).toISOString().slice(0, 16); // ตัดให้เหลือ "yyyy-MM-ddTHH:mm"
  };
  
  const handleDateClick = (arg) => {
    setFormData({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: toInputDateTime(clickInfo.event.startStr),
      end: toInputDateTime(clickInfo.event.endStr || clickInfo.event.startStr),
      backgroundColor: clickInfo.event.backgroundColor,
      type: clickInfo.event.extendedProps?.type || "", // เผื่อไว้ถ้า type ไม่ได้อยู่ใน event main
    });
    setDialogOpen(true);
  };

  const handleEventClick = (clickInfo) => {
    setFormData({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      start: clickInfo.event.startStr,
      end: clickInfo.event.endStr || clickInfo.event.startStr,
      backgroundColor: clickInfo.event.backgroundColor,
    });
    setDialogOpen(true);
  };

  const handleEventDrop = (info) => {
    const updatedEvents = events.map((event) =>
      event.id === info.event.id
        ? {
            ...event,
            start: info.event.startStr,
            end: info.event.endStr || info.event.startStr,
          }
        : event
    );
    setEvents(updatedEvents);
  };

  const handleSave = () => {
    if (formData.id) {
      // update event
      setEvents(events.map((ev) => (ev.id === formData.id ? formData : ev)));

      toast.success("Updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    } else {
      // create new event หรือ เซฟ
      setEvents([...events, { ...formData, id: Date.now().toString(), type: formData.type }]);


      toast.success("Saved successfully!", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    setDialogOpen(false);
  };

  const handleDelete = () => {
    if (formData.id) {
      setEvents(events.filter((ev) => ev.id !== formData.id));
    }
    setDialogOpen(false);

    toast.error("Deleted successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "type") {
      setFormData({ 
        ...formData,
        type: value,
        backgroundColor: typeColors[value] || getRandomColor(),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  //โหลดจาก localStorage
  React.useEffect(() => {
    const savedEvents = localStorage.getItem("calendar-events");
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // เซฟเข้า localStorage
  React.useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events));
  }, [events]);

  return (
    <div className="p-4">
      <h1 className="text-md md:text-xl lg:tex-2xl font-bold text-gray-700 dark:text-white mb-4">
        🗓️ Calendar & Events
      </h1>
      <div className="w-full mx-auto p-4 sm:p-6 lg:p-8 bg-white dark:bg-gray-900 text-gray-700 dark:text-white rounded-lg shadow max-w-full md:max-w-4xl lg:max-w-5xl">
        <style>
          {`  
            /* ✅ ชื่อเดือน / ปี */
            .fc-toolbar-title {
            font-size: 1.25rem;
            font-weight: 500;
            color: #1f2937; /* gray-800 */
            }

            .dark .fc-toolbar-title {
            color: #f9fafb; /* gray-50 */
            }

            /* พื้นหลังและตัวหนังสือ */
            .fc {
            background-color: white;
            color: #111827; /* Gray-800 */
            }

            .dark .fc {
            background-color: #111827; /* Gray-800 */
            color: #f9fafb; /* Gray-50 */
            }

            /* หัวตาราง Sun - Sat */
            .fc .fc-col-header-cell {
            background-color: #9FB3DF; /* Gray-100 */
            color: #374151; /* Gray-700 */
            font-weight: 600;
            padding: 8px;
            }

            .dark .fc .fc-col-header-cell {
            background-color: #374151; /* Gray-700 */
            color: #e5e7eb; /* Gray-200 */
            }

            /* เส้น grid */
            .fc .fc-daygrid-day {
            border: 1px solid #e5e7eb; /* Gray-200 */
            }

            .dark .fc .fc-daygrid-day {
            border: 1px solid #706D54; /* Gray-600 */
            }

            /* Hover effect on cells */
            .fc .fc-daygrid-day:hover {
                background-color: #f9fafb;
            }

            .dark .fc .fc-daygrid-day:hover {
                background-color: #1e293b;
            }

            /* วันที่วันนี้ */
            .fc .fc-day-today {
            background-color: #e0f2fe; /* Sky-100 */
            }

            .dark .fc .fc-day-today {
            background-color: #706D54; /
            }

            /* Events */
            .fc-event {
                padding: 4px 6px;
                border-radius: 6px;
                border: none;
                font-size: 0.875rem;
                font-weight: 500;
            }

            .fc-event:hover {
                opacity: 0.9;
                cursor: pointer;
            }
            /* Custom spacing for toolbar buttons */
                .fc-toolbar-chunk {
                display: flex flex-col;
                gap: 8px; /* เพิ่มช่องไฟระหว่างปุ่ม */
            }

            @media (max-width: 640px) {
                .fc-toolbar-chunk {
                    gap: 0; /* ช่องไฟมากขึ้นบนมือถือ */
                }
            } 
            /* ✅ ปรับขนาดปุ่มทั้งหมด */
            .fc .fc-button {
                font-size: 0.75rem;        /* ขนาดตัวอักษร */
                padding: 0.25rem 0.75rem;  /* ปรับ padding ด้านใน */
                border-radius: 0.375rem;   /* มนมนิดๆ */
            }

            /* ✅ ปุ่ม Today เน้นให้แตกต่าง */
            .fc .fc-button.fc-today-button {
                background-color: #2563eb; /* bg-blue-600 */
                color: white;
                font-weight: 500;
            }

            /* ✅ ปรับระยะห่างปุ่มในมือถือ */
            @media (max-width: 640px) {
                .fc .fc-toolbar.fc-header-toolbar .fc-toolbar-chunk:first-child {
                margin-right: 0.5rem;
                }

            .fc .fc-button {
                padding: 0.2rem 0.5rem;
                font-size: 0.7rem;
                }
            }
            /* ✅ เปลี่ยนสีพื้นหลังของแถววันที่ (หัววัน) */
            .dark .fc .fc-list-day {
                background-color: #1f2937; /* Tailwind: bg-gray-800 */
                color: #4b5563;            /* Tailwind: text-gray-50 */
            }

            /* ✅ เปลี่ยนพื้นหลังของแต่ละกิจกรรมใน list view */
            .dark .fc .fc-list-event {
                background-color: #374151; /* Tailwind: bg-gray-700 */
                color: #e5e7eb;            /* Tailwind: text-gray-200 */
                border-color: #4b5563;     /* Tailwind: border-gray-600 */
            }

            /* ✅ ถ้าอยากให้มี hover effect */
            .dark .fc .fc-list-event:hover {
                background-color: #4b5563;
                cursor: pointer;
                color: #4b5563;
            }
            
        `}
        </style>
          <div>
            <FullCalendar
              plugins={[
                dayGridPlugin,
                interactionPlugin,
                timeGridPlugin,
                listPlugin,
              ]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay,listYear", // 👈 เพิ่มตรงนี้
              }}
              buttonText={{
                today: "today",
                month: "month",
                week: "week",
                day: "day",
                listYear: "year",
              }}
              editable={true}
              selectable={true}
              events={events}
              dateClick={handleDateClick}
              eventClick={handleEventClick}
              eventDrop={handleEventDrop}
              dayCellClassNames={(arg) => {
                const isWeekend =
                  arg.date.getDay() === 0 || arg.date.getDay() === 6;
                return isWeekend ? "bg-gray-300 dark:bg-gray-800" : "";
              }}
              eventDisplay="block"
              height="auto"
              className="text-sm sm:text-base"
            />
          </div>
          {/* <div>
            <EventManager
              formData={formData}
              setFormData={setFormData}
              onSave={handleSave}
              onDelete={handleDelete}
              isEditing={!!formData.id}
            />
          </div> */}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onClose={() => setDialogOpen(false)}
      >
        <div className="bg-white dark:bg-gray-800 rounded w-full max-w-[95vw] sm:max-w-md p-4 sm:p-6">
          {/*   ปุ่มปิด */}
          <button
            onClick={() => setDialogOpen(false)}
            className="absolute top-2 right-4 text-gray-400 hover:text-black dark:hover:text-white text-3xl"
          >
            &times;
          </button>
          <h3 className="text-lg font-semibold mb-4 text-center dark:text-white">
            {formData.id ? "✏️ Edit Event" : "➕ Create Event"}
          </h3>
          <div className="space-y-2 dark:text-gray-300">
            <div>
              <Label>Title</Label>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>Start</Label>
              <Input
                name="start"
                type="datetime-local"
                value={formData.start}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label>End</Label>
              <Input
                name="end"
                type="datetime-local"
                value={formData.end}
                onChange={handleChange}
              />
            </div>
            {/* 👇 ใส่ select ตรงนี้ได้เลย! */}
            <div>
              <Label>Type</Label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
              >
                <option value="">-- Select Type Events --</option>
                <option value="meeting">📅 Meeting</option>
                <option value="task">✅ Task</option>
                <option value="personal">👤 Personal</option>
                <option value="other">✨ Other</option>
              </select>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={handleSave}
                className={`w-full ${
                  formData.id
                    ? "bg-amber-300 hover:bg-amber-400 text-white "
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {formData.id ? "✏️ Update" : "Add"}
              </Button>
              {formData.id && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="px-3"
                >
                  <MdDeleteForever size={20} className="mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default Calendar;
