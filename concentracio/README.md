# Concentració del mercat

## Pregunta central

La propietat (o el control) de l'habitatge a Barcelona està prou concentrada perquè els
propietaris tinguin **poder de mercat**, és a dir, perquè puguin fixar preus per sobre del que
hi hauria en un mercat competitiu? I si n'hi ha, quina part dels lloguers explica?

Concentració i poder de mercat no són el mateix. El poder de mercat depèn de tres coses:
la quota de cada propietari, la mida del **mercat rellevant** (on poden anar els llogaters
si un propietari apuja el preu) i la capacitat de **retenir oferta** (deixar pisos buits).

Àmbit: primer Barcelona ciutat. Després, l'AMB.

## Marc teòric (breu)

Amb competència de tipus Cournot, el marge mitjà del mercat és

```
L = (p − c) / p = HHI / ε
```

on `HHI = Σ sᵢ²` (quotes en tant per u) i `ε` és l'elasticitat de la demanda del mercat.
Amb les dades de l'O-HB, a escala de ciutat i per al parc total, aquest marge és com a molt
d'un 0,1 % (vegeu el càlcul més avall). **A aquesta escala, la concentració clàssica no
explica els preus.**

Per tant, si hi ha poder de mercat, hauria de venir d'algun d'aquests llocs:

1. **Mercats locals o segments petits** (barri, edifici, tipus de producte), on pocs
   propietaris pesen molt. Però en un mercat petit la demanda també és més elàstica,
   perquè el llogater pot marxar al barri del costat. Això és el que estimen
   Watson & Ziv per a Nova York; enllaça amb el tema del model de localització.
2. **El parc de lloguer**, on la concentració és molt més alta que al parc total.
3. **Retenció d'oferta:** un propietari gran que internalitza que un pis buit fa pujar el preu
   de la resta dels seus pisos.
4. **Concentració en la intermediació, no en la propietat:** agències, administradors de
   finques, portals o algorismes de preus compartits (vegeu Calder-Wang & Kim).

## Què sabem ja

Només fonts primàries: informes originals, textos legals i dades. No fem servir premsa.

### Parc total, ciutat de Barcelona (gener 2025)

Font: [O-HB, *Estructura i concentració de la propietat d'habitatges a la ciutat de Barcelona 2025*](https://recam.amb.cat/bitstreams/03203c5f-f1ec-49cd-ad2c-56dc55eb3135/download)
(desembre 2025). Dades: base alfanumèrica del Cadastre i Registre Cadastral Municipal
(contribuents de l'IBI pseudoanonimitzats, a 31/01/2025).

| Dada | Propietaris | Habitatges |
|---|---|---|
| Total | 525.440 | 792.884 (estimació O-HB), 1,5 per propietari |
| Amb un sol habitatge | 83,5 % | 55,3 % |
| Amb 5 o més | 2,2 % (11.700) | 22,8 % (181.130) |
| Amb més de 10 | 0,8 % (4.460) | 16,8 % (133.249) |
| Amb més de 15 | 0,5 % (2.572) | 13,8 % (109.332) |
| Persones físiques | 96,3 % | 84,5 % |
| Persones jurídiques | 3,7 % | 15,2 % (120.574) |
| … de les quals empreses | | 12,0 % (95.369) |
| … de les quals administració pública | | 1,6 % (12.832) |

**Els 10 propietaris més grans** (Taula C de l'informe): tres administracions públiques
(4.791, 3.983 i 2.559 habitatges) i set empreses (1.309, 980, 933, 804, 698, 605 i 513).
El propietari privat més gran té el **0,17 %** del parc de la ciutat.

**Càlcul propi a partir d'aquestes taules:**

- CR1 = 0,6 %, CR3 = 1,4 %, CR10 = 2,2 %.
- HHI ≤ **5,6** sobre 10.000. Els 10 primers hi aporten 0,8. La resta n'aporta com a màxim
  4,8, perquè l'11è propietari té 387 habitatges i cap altre en pot tenir més.
- Marge de Cournot `L = HHI / ε` ≤ 0,11 % amb ε = 0,5 (≤ 0,19 % amb ε = 0,3).

### Parc de lloguer (1 de gener de 2023)

Font: [O-HB, *Estructura i concentració de la propietat del parc de lloguer a la demarcació de Barcelona 2023*](https://recam.amb.cat/bitstreams/080a7897-75e0-49ce-b8c2-e022b583dbec/download)
(gener 2024). Dades: Registre de fiances de l'INCASÒL.

| Dada | Demarcació de Barcelona | Ciutat de Barcelona |
|---|---|---|
| Propietaris / habitatges llogats | 305.709 / 589.272 | 113.527 / 240.369 |
| 5 o més habitatges llogats | 4,5 % dels propietaris, 36,3 % dels habitatges | 7,5 % (8.538), **44,7 %** (107.539) |
| Més de 10 | 1,4 % / 25,7 % | 2,8 % (3.155) / 32,6 % (78.380) |
| Més de 15 | 0,8 % / 21,7 % | 1,6 % (1.863) / 27,1 % (65.076) |
| 50 o més | | 0,3 % (319) / 14,2 % (34.212) |
| 300 o més | 38 propietaris, 7,7 % (45.569) | |
| Persones jurídiques | 8,1 % / 29,6 % | 84.768 habitatges, el 35,3 % del parc de lloguer (càlcul propi) |

### Cadastre, ciutat de Barcelona (2026, càlcul propi)

Font: [Open Data BCN `est-cadastre-habitatges-propietari`](https://opendata-ajuntament.barcelona.cat/data/ca/dataset/est-cadastre-habitatges-propietari).
836.621 locals d'habitatge. Persona física espanyola 78,8 %, estrangera 5,6 %, SL 10,0 %,
SA 2,1 %, corporacions locals 1,4 %, altres 2,1 %.

### Lectures ràpides

- **H1a es compleix per al parc total a escala de ciutat.** El propietari més gran és públic i
  té el 0,6 % dels habitatges. El privat més gran, el 0,17 %.
- **La concentració és molt més alta al parc de lloguer**, que és el mercat rellevant per als
  lloguers. A la ciutat, els propietaris de 5 o més habitatges tenen el 44,7 % del lloguer.
  Però "5 o més" no és una quota alta: aquest 44,7 % està repartit entre 8.538 propietaris.
  **Per al lloguer no tenim la llista dels propietaris més grans.** És el buit principal.
- Els propietaris més grans són **públics**. Tenen quota però no fixen preus com un
  monopolista, i cal tractar-los a part.

### Incoherències per aclarir (amb l'O-HB)

- Informe 2025, Taula 1: 15 propietaris amb 300 o més habitatges sumen 20.650. Taula C: els
  10 primers sumen 17.175 i l'11è en té 387. Els 5 que falten haurien de tenir 695 de mitjana,
  més que l'11è. Les dues taules no quadren.
- Informe 2025: les empreses són 14.410 titulars als *Destacats* i 14.888 al capítol 2.
- El cadastre d'Open Data BCN dona 836.621 locals d'habitatge i l'O-HB n'estima 792.884.
  Segons la metodologia de l'O-HB, la seva estimació parteix de les construccions
  cadastrals, no dels immobles de l'IBI. Cal veure si això explica tota la diferència.
- L'O-HB avisa que les cinc edicions de l'informe de la ciutat (2018, 2019, 2021, 2023, 2025)
  **no són directament comparables**. Això limita P3.

## Context legal (afecta les dades i els incentius)

- **Llei 12/2023, art. 3.k**
  ([BOE-A-2023-12203](https://www.boe.es/buscar/act.php?id=BOE-A-2023-12203)): gran
  tenidor és qui té més de 10 immobles urbans d'ús residencial o més de 1.500 m² d'ús
  residencial. En zones tensionades, la comunitat autònoma pot baixar el llindar a 5 o més
  immobles ubicats a la zona.
- **Barcelona és zona de mercat residencial tensionat** per la Resolució TER/800/2024, de 13
  de març, recollida a [BOE-A-2024-5214](https://www.boe.es/boe/dias/2024/03/15/pdfs/BOE-A-2024-5214.pdf).
  La vigència és de tres anys. Gran tenidor és la persona física o jurídica titular de
  **5 o més immobles d'ús residencial ubicats a la zona**.
- **Límits de renda en contractes nous**
  ([LAU, art. 17.6 i 17.7](https://www.boe.es/buscar/act.php?id=BOE-A-1994-26003)):
  - Tots els propietaris: la renda nova no pot superar la del darrer contracte dels últims
    cinc anys, actualitzada (17.6).
  - Grans tenidors: a més, no pot superar l'índex de preus de referència (17.7, primer
    paràgraf).
  - Habitatges sense contracte en els últims cinc anys: també topall de l'índex (17.7, segon
    paràgraf, activat per la resolució catalana).

  Això crea una **discontinuïtat al llindar de 5 habitatges** (vegeu P6).
- Les persones jurídiques amb més de 10 habitatges han de comunicar la condició de gran
  tenidor a l'Agència de l'Habitatge de Catalunya
  ([tràmit](https://tramits.gencat.cat/ca/tramits/tramits-temes/Comunicacio-de-la-condicio-de-gran-tenidor-dhabitatge)).
  Existeix un registre administratiu, però no és públic.
- Abans: la Llei catalana 11/2020 de contenció de rendes, anul·lada en bona part pel
  Tribunal Constitucional el 2022.

## Preguntes i hipòtesis

### P1. Quina concentració hi ha? (descriptiva)

Mesures: % d'habitatges en mans de persones jurídiques; % en mans de propietaris amb ≥5,
>10 i >15 habitatges; CR1, CR5 i CR10; HHI; corba de Lorenz de la tinença.
Per separat per a: parc total, parc de lloguer, contractes nous (flux) i oferta anunciada.

- **H1a.** A escala de ciutat la propietat està atomitzada (HHI < 100 sobre 10.000).
  Per tant, el poder de mercat per concentració clàssica és negligible a aquesta escala.
- **H1b.** Hi ha concentració alta en submercats concrets: lloguer, obra nova, certs barris,
  edificis sencers d'un sol propietari.

*Com les separem:* HHI i CR-N per barri i segment. H1b prediu que una part no negligible
dels barris té un HHI de lloguer > 1.500 (llindar habitual de "moderadament concentrat").

*Estat:* H1a es compleix per al **parc total** de la ciutat (HHI ≤ 5,6). Falta el parc de
lloguer i l'escala de barri.

### P2. Quin és el mercat rellevant?

Sense definir el mercat, l'HHI no vol dir res. Dimensions: producte (lloguer habitual,
temporada, habitacions, compra, obra nova, HUT), territori (barri, districte, ciutat, AMB)
i estoc o flux.

- **H2a.** Els llogaters substitueixen molt entre barris i cap a l'AMB. El mercat és ample,
  la demanda que afronta cada barri és molt elàstica i la concentració local no importa.
- **H2b.** El mercat està segmentat (feina, escola, xarxa social, transport). Els mercats
  efectius són petits i pocs propietaris hi poden pesar.

*Com les separem:* moviments residencials del padró (canvis de domicili dins la ciutat i
cap a l'AMB); correlació entre els lloguers de barris veïns davant de xocs locals;
elasticitats creuades d'un model de demanda espacial (tema *model de localització*).

### P3. Ha canviat la concentració amb el temps?

- **H3a.** Va pujar entre 2013 i 2019 per l'entrada de fons i SOCIMIs, que van comprar
  carteres de bancs i de la SAREB després de la crisi.
- **H3b.** Es va estabilitzar o va baixar després del 2020 per la regulació (Llei 11/2020,
  Llei 12/2023, llindar de 5 habitatges): venda de carteres o fragmentació en societats.
- **H3c.** No ha canviat gaire. El relat sobre els fons és més visible que quantitativament
  important.

*Com les separem:* la sèrie del cadastre a Open Data BCN (2009–2026, per secció censal i tipus
de propietari) permet veure l'evolució del pes de les persones jurídiques per barri i any.
**És el primer pas que podem fer amb dades obertes.** Compte: una SL familiar amb un pis és
una persona jurídica però no és un gran tenidor. Les edicions de l'informe de l'O-HB donen la
mida de la tinença, però no són directament comparables entre elles.

### P4. Els grans propietaris cobren més per un habitatge igual?

- **H4a.** Sí, per poder de mercat local.
- **H4b.** Sí, però per selecció: tenen pisos millors o més cèntrics. La diferència
  desapareix amb controls d'habitatge o efectes fixos d'edifici.
- **H4c.** No, o cobren menys: professionals que minimitzen la vacància, o, des del 2024,
  limitats per l'índex de referència.

*Com les separem:* microdades de fiances de l'INCASÒL (renda, característiques i tipus
d'arrendador). Comparar dins del mateix edifici o secció censal. H4a prediu que la prima
creix amb la **quota local** del propietari, no només amb la seva mida total.

### P5. Retenen oferta (habitatge buit) per sostenir preus?

- **H5a.** Vacància més alta en grans tenidors per estratègia (*withholding*).
- **H5b.** Vacància més alta per motius operatius: rehabilitació, carteres en venda,
  rotació, litigis.
- **H5c.** No hi ha diferència de vacància.

*Com les separem:* la predicció clau de H5a és que la vacància creix amb la **quota local**
del propietari (només llavors un pis buit puja el preu de la resta dels seus pisos).
H5b prediu que creix amb la mida, l'antiguitat o l'estat de l'edifici, independentment
de la quota local.
Dades: habitatges buits del Cens 2021 de l'INE (estimats amb consum elèctric) per secció
censal; registre d'habitatges buits de l'Agència de l'Habitatge.

### P6. La regulació crea incentius per no ser gran tenidor?

Amb el llindar de 5 habitatges a la zona tensionada:

- **H6a.** *Bunching* just per sota del llindar: propietaris de 5–6 pisos que en venen un o
  els reparteixen entre familiars o societats.
- **H6b.** Fuga cap al lloguer de temporada o per habitacions per evitar el límit.
- **H6c.** Venda de carteres de grans tenidors a petits propietaris, cosa que redueix la
  concentració mesurada sense que canviï res més.

*Com les separem:* distribució del nombre d'habitatges per propietari abans i després del
març del 2024 (les taules per trams dels informes de l'O-HB del 2023 i el 2025 ja separen
"de 4" i "de 5"); pes dels contractes de temporada en les fiances; canvis de titularitat al
cadastre. Cal tenir en compte que les edicions no són directament comparables.

### P7. La concentració que importa és la de la propietat o la de la intermediació?

- **H7a.** Encara que la propietat estigui atomitzada, els preus els fixen pocs
  intermediaris (agències, administradors de finques o eines de preus comunes), cosa que
  coordina els preus.
- **H7b.** La intermediació és competitiva i no hi ha coordinació.

*Com les separem:* quota d'anuncis de les agències principals per barri (portals); dispersió
de preus entre pisos comparables; sincronització dels canvis de preu entre pisos d'una
mateixa agència en comparació amb la resta.

### P8. (enllaç amb altres temes) Concentració en l'oferta nova i el sòl

Pocs promotors i propietaris de sòl podrien controlar el ritme d'obra nova. Es tractarà
amb el tema *cost de construcció*.

## Dades

| Font | Què conté | Nivell | Accés | Preguntes |
|---|---|---|---|---|
| [Open Data BCN: habitatges per tipus de propietari](https://opendata-ajuntament.barcelona.cat/data/ca/dataset/est-cadastre-habitatges-propietari) | Nombre i superfície de locals d'habitatge per tipus de propietari (19 categories) i nacionalitat. 2009–2026 | Secció censal | Obert (CSV) | P1, P3 |
| Open Data BCN: càrrecs cadastrals per tipus de propietari (`est-cadastre-carrecs-tipus-propietari`) | Valor cadastral i càrrecs per tipus de propietari (físic o jurídic) | Secció censal | Obert (CSV) | P1 |
| Informes de l'O-HB sobre la propietat a la ciutat (2018, 2019, 2021, 2023, 2025) | Trams de tinença, tipus de propietari, dades per barri, top-10 propietaris | Ciutat i barri | PDF al [repositori de l'AMB](https://recam.amb.cat/) | P1, P3, P6 |
| Informe de l'O-HB sobre el parc de lloguer (2023) | Trams de tinença i tipus de propietari del parc de lloguer | Demarcació, ciutat, resta AMB | PDF | P1, P6 |
| Fiances de l'INCASÒL | Contractes de lloguer amb renda i arrendador | Habitatge | Microdades restringides (l'O-HB hi té accés). Idescat en publica agregats per municipi i barri | P4, P6 |
| Cadastre (DG del Catastro) | Titularitat per immoble | Immoble | Dades protegides. Possible petició per a recerca | P1, P6 |
| Comptes de SOCIMIs i fons (CNMV, BME Growth) | Carteres per ciutat | Cartera | Públic | P1 (top-N del lloguer) |
| INE, Cens 2021 | Habitatges buits i esporàdics | Secció censal | Obert | P5 |
| Portals (Idealista, Fotocasa, Habitaclia) | Anuncis, preu i anunciant | Anunci | *Scraping* (cal mirar les condicions d'ús) | P2, P4, P7 |
| Padró (Open Data BCN) | Canvis de domicili | Barri | Obert | P2 |

Sobre l'accés a la identitat dels grans tenidors:
[dictamen APDCAT IAI 60/2021](https://apdcat.gencat.cat/web/.content/Resolucio/Resolucions_Cercador/Dictamens/2021/Documents/ca_iai_2021_060.pdf)
(sobre la llista de grans tenidors amb fiances a l'INCASÒL) i
[sol·licitud de transparència a l'Ajuntament, exp. 656/2022](https://ajuntament.barcelona.cat/transparencia/sites/default/files/2022_exp_656_acces_al_llistat_de_grans_tenidors.pdf).
Pendents de llegir.

## Pla

Passos petits, del més fàcil al més difícil:

1. **Sèrie del cadastre 2009–2026** (Open Data BCN): pes de les persones jurídiques per barri
   i any. Gràfic i mapa. *(P3, només dades obertes)*
2. **Aclarir amb l'O-HB** les incoherències de les taules i si poden donar el top-N del
   parc de lloguer.
3. **Top-N del parc de lloguer** (públics, SOCIMIs, fons), a partir de memòries i comptes.
   Calcular CR-N i una cota de l'HHI per al lloguer a la ciutat.
4. **HHI i marge `L = HHI / ε` per barri** (Annex 1 de l'informe 2025, que dona trams per
   barri) amb un rang d'elasticitats. Si surt negligible fins i tot a escala de barri, ho
   diem i prioritzem P5 i P7.
5. Decidir si cal **demanar microdades** (fiances INCASÒL via O-HB, Cadastre) per a P4–P6.
6. Estendre a l'**AMB**.

## Lectures

Sobre Barcelona:

- O-HB (2025). [*Estructura i concentració de la propietat d'habitatges a la ciutat de Barcelona 2025*](https://recam.amb.cat/bitstreams/03203c5f-f1ec-49cd-ad2c-56dc55eb3135/download).
  Edició anterior: [2023](https://recam.amb.cat/bitstreams/113a3c1a-7e51-4355-9a7d-2c0b3507155d/download).
- O-HB (2024). [*Estructura i concentració de la propietat del parc de lloguer a la demarcació de Barcelona 2023*](https://recam.amb.cat/bitstreams/080a7897-75e0-49ce-b8c2-e022b583dbec/download).
- O-HB (2025). [*Informe de seguiment semestral de la Zona de Mercat Residencial Tens (ZMRT) Barcelona*, núm. 3](https://recam.amb.cat/bitstreams/7ce226a8-43f9-4507-bd89-02d2973ddc28/download). Per a P6.
- García-Lamarca, M. (2021). *Real estate crisis resolution regimes and residential REITs:
  emerging socio-spatial impacts in Barcelona*. Housing Studies 36(9), 1407–1426.
  [doi:10.1080/02673037.2020.1769034](https://doi.org/10.1080/02673037.2020.1769034)
- Ajuntament de Barcelona: [Propietat BCN 2018](https://bcnroc.ajuntament.barcelona.cat/jspui/bitstream/11703/118864/3/Propietat-BCN-2018.pdf.txt),
  [Lab Propietat 2019–2020](https://bcnroc.ajuntament.barcelona.cat/jspui/bitstream/11703/119340/3/Lab_Propietat_2019-2020-VF.pdf.txt),
  [Lab Propietat INCASÒL (juny 2020)](https://bcnroc.ajuntament.barcelona.cat/jspui/bitstream/11703/119447/4/Lab_Propietat_Incasol_juny2020.pdf.txt).

Teoria i evidència a altres ciutats:

- Watson, C. L. & Ziv, O. *Is the Rent Too High? Land Ownership and Monopoly Power*.
  [CESifo WP 8864](https://www.cesifo.org/en/publications/2021/working-paper/rent-too-high-land-ownership-and-monopoly-power);
  publicat a Real Estate Economics ([doi:10.1111/1540-6229.70056](https://doi.org/10.1111/1540-6229.70056)).
  Nova York: concentració de la propietat per *census tract* i marges sobre el lloguer.
- Watson, C. L. & Ziv, O. *A Test for Pricing Power in Urban Housing Markets*.
  [PDF](https://clukewatson.github.io/research/tfpp/tfpp_watsonziv.pdf).
  Test de poder de mercat a partir de la transmissió de xocs fiscals als lloguers.
- Calder-Wang, S. & Kim, G. H. *Algorithmic Pricing in Multifamily Rentals: Efficiency Gains
  or Price Coordination?* [Working paper](https://faculty.wharton.upenn.edu/publications/working-papers/algorithmic-pricing-in-multifamily-rentals-efficiency-gains-or-price-coordination/).
  Per a P7.
