import { Button } from '../../shared';

export default function DescargarConstancia({ folio }) {
  const descargar = () => {
    const blob = new Blob([`Constancia generada - Folio ${folio}`], {
      type: 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Constancia-${folio}.txt`;
    a.click();
  };

  return <Button onClick={descargar}>Descargar</Button>;
}
