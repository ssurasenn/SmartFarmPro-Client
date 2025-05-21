

const RenderCell = ({ row, index, isEditing, handleEditChange }) => {
  const renderInput = (field) => (
    <input
      type="text"
      value={row[field] || ""}
      onChange={(e) => handleEditChange(index, field, e.target.value)}
      className="w-full px-2 py-1 border rounded"
    />
  );

  return (
    <>
      <td className="border px-2 py-1">{row.HouseName}</td>
      <td className="border px-2 py-1">
        {isEditing ? renderInput("FlockName") : row.FlockName}
      </td>
      <td className="border px-2 py-1">
        {isEditing ? renderInput("DateStart") : row.DateStart}
      </td>
      <td className="border px-2 py-1">
        {isEditing ? renderInput("DateEnd") : row.DateEnd}
      </td>
      <td className="border px-2 py-1">
        {isEditing ? renderInput("AgeOfStart") : row.AgeOfStart}
      </td>
      <td className="border px-2 py-1">
        {isEditing ? renderInput("FeedPlanning") : row.FeedPlanning}
      </td>
      <td className="border px-2 py-1">
        {isEditing ? renderInput("FocusCatch") : row.FocusCatch}
      </td>
      <td className="border px-2 py-1">
        {isEditing ? renderInput("BreedStandard1") : row.BreedStandard1}
      </td>
      <td className="border px-2 py-1">
        {isEditing ? renderInput("Number1") : row.Number1}
      </td>
      <td className="border px-2 py-1">
        {isEditing ? renderInput("DateCatch") : row.DateCatch}
      </td>
      <td className="border px-2 py-1">
        {isEditing
          ? renderInput("SlaughterhouseWeight")
          : row.SlaughterhouseWeight}
      </td>
    </>
  );
};

export default RenderCell;
