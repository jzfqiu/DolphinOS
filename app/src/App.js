import Window from './Window';

function App() {
  const initialPos = {'x': 100, 'y': 100};
  const initialSize = {'x': 100, 'y': 100}
  return (
    <Window 
      initialPos={initialPos}
      initialSize={initialSize}
    ></Window>
  );
}

export default App;
