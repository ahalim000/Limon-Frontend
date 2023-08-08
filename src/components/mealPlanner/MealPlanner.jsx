import Header from "@/components/header/Header";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import PlanMealModal from "../planMealModal/PlanMealModal";

export default function MealPlanner() {
    let handleDateClick = () => {
        console.log("Hello");
    };

    return (
        <>
            <Header></Header>
            <div className="mt-20 mx-20 meal-plan-item">
                {/* <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    weekends={true}
                    dateClick={handleDateClick}
                    // events={events}
                    // eventContent={renderEventContent}
                ></FullCalendar> */}
                <PlanMealModal></PlanMealModal>
            </div>
        </>
    );
}
