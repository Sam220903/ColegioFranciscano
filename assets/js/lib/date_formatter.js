export function formatDate(fechaStr, format=1) {
  const date = new Date(fechaStr.replace(" ", "T"));

  const day     = date.toLocaleDateString("es-MX", { weekday: "long" });
  const number  = String(date.getDate()).padStart(2, "0");
  const month = date.toLocaleDateString("es-MX", { month: "long" });
  const month_abr = date.toLocaleDateString("es-MX", { month: "short" });
  const year    = date.getFullYear();

  const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

  switch(format) {
    // Format: DAY DD de MONTH del YEAR
    case 1:
      return `${capitalize (day)} ${number} de ${capitalize(month)} del ${year}`;
    
    // Format: dd - MM - Year
    case 2:
      return `${number} - ${capitalize(month_abr)} - ${year}`;
  }
}

