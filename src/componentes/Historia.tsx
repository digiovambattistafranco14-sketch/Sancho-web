import { Revelar } from './Revelar';
import { Asterisco } from './Trazos';

/**
 * El relato propio de la marca: la familia Terpolilli, Don Quijote, y el chiste
 * de que Sancho —el escudero pragmático, el que tenía hambre— abrió en el mismo
 * local donde nació el primer Quijote de City Bell.
 */
export function Historia() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-marino)] py-24 text-[var(--color-cal)] sm:py-32">
      <div className="contenedor">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <Revelar className="lg:col-span-5">
            <p className="etiqueta mb-7 flex items-center gap-2.5 text-[var(--color-cal)]/70">
              <Asterisco className="h-3 w-3" />
              La historia
            </p>
            <h2 className="titular-seccion text-[var(--color-cal)]">
              Cincuenta años
              <br />
              <span className="subrayado subrayado-cal">a media cuadra.</span>
            </h2>
          </Revelar>

          <div className="space-y-7 text-[1.075rem] leading-[1.7] text-[var(--color-cal)]/78 lg:col-span-6 lg:col-start-7 sm:text-[1.15rem]">
            <Revelar retraso={1}>
              <p>
                En este local nació el primer <strong className="font-semibold text-[var(--color-cal)]">Don
                Quijote</strong> de City Bell. Los Terpolilli llevan más de medio siglo dando de
                comer en La Plata, y cuando llegó el momento de hacer algo nuevo en la misma
                esquina, Nicolás no buscó demasiado lejos el nombre.
              </p>
            </Revelar>

            <Revelar retraso={2}>
              <p className="editorial text-[1.5rem] leading-[1.35] text-[var(--color-cal)] sm:text-[1.9rem]">
                Porque si Quijote era el de los molinos y los ideales, Sancho era el otro: el
                que llevaba las alforjas, el que paraba en la posada, el que tenía hambre.
              </p>
            </Revelar>

            <Revelar retraso={3}>
              <p>
                De ahí sale todo lo demás. Nada de mantel largo ni de plato principal. Barras
                altas, mesas que se comparten, un mostrador con tapas que cambian según lo que
                haya ese día, y una cerveza en porrón que se toma de parado si hace falta. Se
                pide en la barra, te dan un bipper y comés donde te sientas mejor: adentro, en
                la vereda o en el patio de atrás.
              </p>
            </Revelar>

            <Revelar retraso={4}>
              <p className="text-[var(--color-cal)]/60">
                Sin apuro, sin protocolo y sin reserva.
              </p>
            </Revelar>
          </div>
        </div>
      </div>
    </section>
  );
}
