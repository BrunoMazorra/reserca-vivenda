# reserca-vivenda

Recerca sobre el mercat de l'habitatge a Barcelona i rodalia.

## Intenció

Volem entendre per què l'habitatge a Barcelona és car i per què puja. No farem un gran
model general: aquesta mena d'anàlisi es complica de seguida i acaba sense dir res
contrastable. Partim el problema en **temes**. Per a cada tema fem **preguntes concretes**,
i per a cada pregunta separem **hipòtesis rivals** i busquem quina dada les distingeix.

Principis:

1. **Una pregunta, diverses hipòtesis.** Escrivim totes les explicacions plausibles,
   no només la que ens agrada.
2. **Cada hipòtesi ha de fer una predicció observable** que la distingeixi de les altres.
   Si dues hipòtesis prediuen el mateix, no les podem separar amb aquelles dades, i ho diem.
3. **Primer descriure, després explicar.** Abans de preguntar "per què", mesurem "quant".
4. **Separar conceptes que solen anar barrejats:** estoc i flux (tot el parc o els contractes
   nous), compra i lloguer, ciutat i àrea metropolitana, nivell i variació.
5. **Anar a poc a poc en l'àmbit geogràfic:** primer Barcelona ciutat (10 districtes,
   73 barris), després l'Àrea Metropolitana (AMB, 36 municipis), i si cal la Regió
   Metropolitana (RMB, 164 municipis).
6. **Fonts i dates sempre explícites.** Cada xifra porta la font, l'any de les dades i
   l'àmbit. Les xifres no verificades es marquen.

## Plantilla per a cada tema

Cada tema té el seu directori amb un `README.md` que segueix aquest esquema:

```
Pregunta central
Marc teòric (breu: per què podria importar)
Què sabem ja (xifres amb font)
Preguntes
  P1. ...
     H1a / H1b / ...   hipòtesis rivals
     Com les separem   predicció observable + dada que la contrasta
Dades                  font, què conté, nivell geogràfic, accés
Pla                    passos petits, del més fàcil al més difícil
Lectures
```

## Temes

| Tema | Pregunta central | Estat |
|---|---|---|
| [Concentració del mercat](concentracio/) | La propietat (o el control) de l'habitatge està prou concentrada perquè hi hagi poder de mercat? | En curs |
| Demanda: immigració i estrangers | Quina part de la pressió sobre preus ve de població nova resident i quina de compradors o llogaters estrangers (residents temporals, segona residència, turisme)? | Pendent |
| Crèdit | Quant expliquen els preus les condicions de finançament (tipus d'interès, LTV, oferta de crèdit)? | Pendent |
| Cost de construcció (sense sòl) | Quant costa construir un m² i com ha evolucionat respecte al preu de venda? | Pendent |
| Model de localització | Podem calibrar un model urbà teòric (tipus Alonso-Muth-Mills o model espacial quantitatiu) per a Barcelona i l'AMB? Ja n'hi ha algun? | Pendent |
| Pisos turístics i hotels | Com han evolucionat els habitatges d'ús turístic (HUT) i les places hoteleres, i quin efecte tenen sobre els lloguers? | Pendent |
| Altres | Regulació (control de lloguers, zona tensionada), habitatge buit, oferta i llicències d'obra nova… | Per definir |

Els temes es toquen entre ells. Uns quants punts de contacte que convé tenir presents:

- *Concentració ↔ pisos turístics:* propietaris amb molts HUT.
- *Cost de construcció ↔ model de localització:* el valor residual del sòl és el preu
  menys el cost de construir.
- *Demanda ↔ crèdit:* compradors que no depenen del crèdit local.
- *Concentració ↔ regulació:* la definició legal de "gran tenidor" canvia incentius.

## Estructura del repositori

```
README.md            aquest fitxer: intenció, mètode i índex de temes
concentracio/        tema 1: concentració del mercat
  README.md          preguntes, hipòtesis, dades i pla
<tema>/              un directori per tema, a mesura que hi treballem
  README.md
  dades/             dades descarregades (les grans no es pugen al repo)
  analisi/           scripts i notebooks
```

## Fonts de dades transversals

- [Open Data BCN](https://opendata-ajuntament.barcelona.cat/): cadastre, padró i
  lloguers per barri i secció censal.
- [Idescat](https://www.idescat.cat/) i INCASÒL: estadística de fiances de lloguer.
- [INE](https://www.ine.es/): Cens 2021 (inclou habitatges buits), estadística de
  transmissions de drets de la propietat (ETDP), índex de preus d'habitatge (IPV).
- Notaris (Portal Estadístico del Notariado) i Registradors (Estadística Registral
  Inmobiliaria): compravendes per nacionalitat i per tipus de comprador.
- Ministeri d'Habitatge: índex de preus de referència del lloguer (SERPAVI).
- [Observatori Metropolità de l'Habitatge de Barcelona (O-HB)](https://www.ohb.cat/):
  informes i dades agregades.
- Banc d'Espanya: crèdit hipotecari i tipus d'interès.
