import "./Row.scss"
type RowProps = {
  align?: "start" | "center" | "end"
  gap?: number,
  children?: React.ReactNode
}
export const Row = ({align = "center", gap = 1, children}: RowProps) => {
  return (
    <div className="row" style={{justifyContent: align, gap: `${gap}px`}}>
      {children}
    </div>
  )
}