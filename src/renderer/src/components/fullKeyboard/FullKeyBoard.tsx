import { useState } from 'react'
import Keyboard from 'react-simple-keyboard'
import '../../styles/fullKeyBoard.css'
import 'react-simple-keyboard/build/css/index.css'

interface State {
    input1: string;
    input2: string;
  }

export function FullKeyBoard(): JSX.Element {
 // const [activarKeyBoard, setActivarKeyBoard] = useState(false)
  const [inputIN, setInputIN] = useState<State>({ input1: '', input2: '' })
  const [focus, setFocus] = useState<string>('')

//   const onChange = (input: string) => {
//     // setInputIN({
//     //   ...inputIN,
//     //   [focus]: input
//     // });
//   };
  const onKeyPress = (button: string):void => 
  {
    if(button == "{bksp}"){
      setInputIN({
        ...inputIN,
        [focus]: inputIN[focus as keyof State].substring(0, inputIN[focus as keyof State].length - 1)
      });
    }else {
      setInputIN({
        ...inputIN,
        [focus]: inputIN[focus as keyof State] +  button
      });
    }
    

   // if (button === '{enter}') setActivarKeyBoard(false);
    //if (button === '{shift}' || button === '{lock}') handleShift();
  };
  return (
    <div className='teclado'>
      {' '}
      <Keyboard layoutName={'default'}  onKeyPress={onKeyPress} />
    </div>
  )
}
