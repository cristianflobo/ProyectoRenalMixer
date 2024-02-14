import { useContext } from 'react';
import '../../styles/message.css'
import { MenssageGeneralContext } from '@renderer/utils/MessageGeneralContext';

export function Message(): JSX.Element  {
  const messageContext  = useContext(MenssageGeneralContext) as GlobalContentMessage;
    return (
      <div onClick={()=>messageContext.setmensajeGeneral({view:false, data:""})} className="conteiner-message">
        <span>Mensaje</span>
        <div>
            {messageContext.mensajeGeneral.data}
        </div>
      </div>      
    )
    
}