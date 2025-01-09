import React from "react";
import { Course } from "@/lib/types";
import styles from "@/styles/Home.module.css"

interface SidebarProps {
  courses: Record<string, Course>;
  isOpen: boolean;
  onSelectCourse: (courseKey: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ courses, isOpen, onSelectCourse }) => {
  const groupedCourses = Object.entries(courses).reduce((acc, [key, course]) => {
    const coordinator = course.coordenadorPrincipal || "Sem coordenador";
    if (!acc[coordinator]) {
      acc[coordinator] = [];
    }
    acc[coordinator].push({ key, nome: course.nome });
    return acc;
  }, {} as Record<string, { key: string; nome: string }[]>);

  return (
    <div className={`fixed top-0 left-0 h-full w-full md:w-64 bg-white shadow-lg transform transition-all duration-300 ease-in-out z-50 ${isOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"}`}>
      <div className="p-4 overflow-y-auto h-full">
        {Object.entries(groupedCourses).map(([coordenador, cursos], index) => (
          <div key={coordenador} className={`mb-4 ${index !== 0 ? "border-t border-gray-200 pt-4" : ""}`}>
            <h3 className="font-bold text-lg mb-2 text-orange-500 responsive-text">{coordenador}</h3>
            <ul className="pl-2">
              {cursos.map(curso => (
                <li 
                  key={curso.key} 
                  className="cursor-pointer hover:text-orange-500 transition-colors duration-200 py-1 responsive-text"
                  onClick={() => onSelectCourse(curso.key)}
                >
                  {curso.nome}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;

