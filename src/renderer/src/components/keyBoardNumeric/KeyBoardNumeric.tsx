import useKeyBoardNumeric from '@renderer/hooks/useKeyBoardNumeric'
import '../../styles/keyBoardNumeric.css'

export function KeyBoardNumeric({ setKey }): JSX.Element {
  const { onChangeKey, dataKey, onChangeK } = useKeyBoardNumeric(setKey)

  return (
    <div className="cont-key-board-numeric">
      <input readOnly value={onChangeK}></input>
      <div className="key-board-numeric">
      {dataKey.map((item: Idatakey, i: number) => (
        <button onClick={(event) => onChangeKey(event)} key={i} value={item.value}>
          {item.value}
        </button>
      ))}
      </div>
    </div>
  )
}
