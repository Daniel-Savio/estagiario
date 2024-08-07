import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
import 'tailwindcss/tailwind.css';
import { Home } from './pages/home';
import { createContext, useState, Provider } from 'react';
import { Switch } from '@headlessui/react';
import { Background } from './components/backgorund';


export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [closeWindow, setCloseWindow] = useState(false);
  const [minimizwWindow, setMinimizeWindow] = useState(false);
  const [maximizeWindow, setMaximizeWindow] = useState(true);

  function handleClose() {
    console.log('app is closed');
    window.electron.close();
  }

  function handleMinimize() {
    console.log('app is minimized');
    window.electron.minimize();
  }

  function handleMaximize() {
    console.log('app is minimized');
    window.electron.maximize();
  }

  return (
    
      <div
        className={`${darkMode ? 'dark' : ''} 
                  flex flex-col  h-screen `}
      >
        <Background></Background>

        <header
          id="title-bar"
          className="flex justify-between px-4 py-1 items-center bg-primary"
        >
          <div className="flex items-center ">
            <div className="flex items-center ">
              <img src={require('./img/icon.svg')} className="h-7" />
              <h1 className="text-md px-2 font-bold text-slate-50 hover:cursor-pointer">
                SD Solutions
              </h1>
            </div>
          </div>

          <div id="header-tools" className="flex items-center gap-2">
            <Switch
              checked={darkMode}
              onChange={setDarkMode}
              className={`${
                darkMode ? 'bg-blue-600' : 'bg-gray-300'
              } relative inline-flex h-4 w-8 items-center rounded-full mr-2`}
            >
              <span
                className={`${
                  darkMode ? 'translate-x-5' : 'translate-x-1'
                } inline-block h-2 w-2 transform rounded-full bg-white transition`}
              />
            </Switch>

            <div
              id="minimize"
              onClick={handleMinimize}
              className="hover:cursor-pointer hover:bg-green-400  h-3 w-3 rounded-full bg-green-500"
            ></div>
            <div
              id="maximize"
              onClick={handleMaximize}
              className="hover:cursor-pointer hover:bg-yellow-400 h-3 w-3 rounded-full  bg-yellow-500"
            ></div>
            <div
              id="close"
              onClick={handleClose}
              className="hover:cursor-pointer hover:bg-red-400 h-3 w-3 rounded-full bg-red-500"
            ></div>
          </div>
        </header>

        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </div>
    
  );
}
