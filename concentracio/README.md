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

**Càlcul ràpid.** A la ciutat hi ha uns 525.000 propietaris i la gran majoria en tenen un
sol habitatge. Fins i tot si els 10 més grans tinguessin un 1 % del parc cadascun,
`HHI ≈ 10 × 0,01² = 0,001` (10 punts en l'escala 0–10.000). Amb `ε = 0,5`, el marge seria
del 0,2 %. **A escala de ciutat, la concentració clàssica difícilment explica gaire.**

Per tant, si hi ha poder de mercat, hauria de venir d'algun d'aquests llocs:

1. **Mercats locals o segments petits** (barri, edifici, tipus de producte), on pocs
   propietaris pesen molt. Però en un mercat petit la demanda també és més elàstica,
   perquè el llogater pot marxar al barri del costat. Això és el que estima
   Watson & Ziv per a Nova York; enllaça amb el tema del model de localització.
2. **Retenció d'oferta:** un propietari gran que internalitza que un pis buit fa pujar el preu
   de la resta dels seus pisos.
3. **Concentració en la intermediació, no en la propietat:** agències, administradors de
   finques, portals o algorismes de preus compartits (vegeu Calder-Wang & Kim).

## Què sabem ja

| Àmbit i dada | Xifra | Font |
|---|---|---|
| **Ciutat, tot el parc (dades 2025)** | 525.440 propietaris i 792.884 habitatges (1,5 per propietari) | O-HB, via [Nació Digital, 28/09/2026](https://naciodigital.cat/societat/de-qui-son-els-pisos-a-barcelona-mes-de-la-meitat-en-mans-de-grans-tenidors.html) |
| | Persones físiques: 96,3 % dels propietaris. Persones jurídiques: 3,7 % dels propietaris i 15,2 % dels habitatges | id. |
| | Propietaris amb ≥5 habitatges: 2,2 % dels propietaris, 22,8 % dels habitatges | id. |
| | ≥10 habitatges: 0,8 % / 16,8 %. ≥15 habitatges: 0,5 % / 13,8 % | id. |
| | Propietaris amb un sol habitatge: 83,5 % (l'article també diu 80 %; cal mirar l'informe original) | id. |
| **Parc de lloguer, demarcació de Barcelona (gener 2023)** | 305.709 propietaris i 589.272 habitatges llogats | O-HB, *Estructura i concentració de la propietat del parc de lloguer a la demarcació de Barcelona*, amb fiances de l'INCASÒL, via [betevé](https://beteve.cat/economia/gairebe-4-cada-10-pisos-lloguer-demarcacio-barcelona-grans-tenidors/) |
| | ≥5 habitatges llogats: 4,5 % dels propietaris, 36,3 % dels habitatges. ≥10: 1,4 % / 25,7 % | id. |
| **Parc de lloguer, ciutat de Barcelona (gener 2023)** | ≥5 habitatges llogats: 7,5 % dels propietaris, **44,7 % dels habitatges de lloguer** | id. |
| | Persones jurídiques: 35,3 % dels habitatges de lloguer a la ciutat, 25,1 % a la resta de l'àrea metropolitana | id. |
| **Ciutat, cadastre (2026, càlcul propi)** | 836.621 locals d'habitatge. Persona física espanyola 78,8 %, estrangera 5,6 %, SL 10,0 %, SA 2,1 %, corporacions locals 1,4 %, altres 2,1 % | [Open Data BCN `est-cadastre-habitatges-propietari`](https://opendata-ajuntament.barcelona.cat/data/ca/dataset/est-cadastre-habitatges-propietari) |

Lectures ràpides:

- La concentració és **molt més alta al parc de lloguer que al parc total**. El mercat
  rellevant per als preus de lloguer és el lloguer, no tot el parc.
- "≥5 habitatges" no és el mateix que una quota alta. El 44,7 % del lloguer està repartit
  entre milers de propietaris. Per calcular l'HHI necessitem les quotes dels més grans.
- El propietari individual més gran probablement és **públic** (Ajuntament i Generalitat).
  Té una quota alta però no fixa preus com un monopolista. Cal tractar-lo a part.
- Els totals del cadastre (836.621) i de l'O-HB (792.884) no quadren. Probablement
  la unitat és diferent (local cadastral o habitatge). Cal reconciliar-los.

## Context legal (afecta les dades i els incentius)

- **Llei 12/2023** (estatal), art. 3.k: defineix el gran tenidor (en general, més de 10
  habitatges).
- **Barcelona és zona de mercat residencial tensionat** des del març del 2024
  ([BOE-A-2024-5214](https://www.boe.es/boe/dias/2024/03/15/pdfs/BOE-A-2024-5214.pdf)).
  A les zones tensionades de Catalunya, el llindar baixa a **5 o més habitatges**.
- En contractes nous en zona tensionada, el **gran tenidor** queda limitat per l'índex de
  referència (SERPAVI). El **petit propietari** queda limitat per la renda del contracte
  anterior. Això crea una **discontinuïtat al llindar de 5 habitatges** (vegeu P6).
- Les persones jurídiques amb més de 10 habitatges han de comunicar la condició de gran
  tenidor a l'Agència de l'Habitatge de Catalunya
  ([tràmit](https://tramits.gencat.cat/ca/tramits/tramits-temes/Comunicacio-de-la-condicio-de-gran-tenidor-dhabitatge)).
  Existeix un registre administratiu, però no és públic.
- Abans: la Llei catalana 11/2020 de contenció de rendes, anul·lada en bona part pel
  Tribunal Constitucional el 2022.

## Preguntes i hipòtesis

### P1. Quina concentració hi ha? (descriptiva)

Mesures: % d'habitatges en mans de persones jurídiques; % en mans de propietaris amb ≥5,
≥10 i ≥15 habitatges; CR1, CR5 i CR10; HHI; corba de Lorenz de la tinença.
Per separat per a: parc total, parc de lloguer, contractes nous (flux) i oferta anunciada.

- **H1a.** A escala de ciutat la propietat està atomitzada (HHI < 100 sobre 10.000).
  Per tant, el poder de mercat per concentració clàssica és negligible a aquesta escala.
- **H1b.** Hi ha concentració alta en submercats concrets: lloguer, obra nova, certs barris,
  edificis sencers d'un sol propietari.

*Com les separem:* HHI i CR-N per barri i segment. H1b prediu que una part no negligible
dels barris té un HHI de lloguer > 1.500 (llindar habitual de "moderadament concentrat").

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
una persona jurídica però no és un gran tenidor. Per a la mida de la tinença calen els
informes de l'O-HB.

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

Amb el llindar de 5 habitatges en zona tensionada:

- **H6a.** *Bunching* just per sota del llindar: propietaris de 5–6 pisos que en venen un o
  els reparteixen entre familiars o societats.
- **H6b.** Fuga cap al lloguer de temporada o per habitacions per evitar el límit.
- **H6c.** Venda de carteres de grans tenidors a petits propietaris, cosa que redueix la
  concentració mesurada sense que canviï res més.

*Com les separem:* distribució del nombre d'habitatges per propietari abans i després del
març del 2024 (cal la distribució per trams de l'O-HB o del Cadastre); pes dels contractes
de temporada en les fiances; canvis de titularitat al cadastre.

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
| Open Data BCN: càrrecs cadastrals per tipus de propietari (`est-cadastre-carrecs-tipus-propietari`) | Valor cadastral i càrrecs per tipus de propietari (físic o jurídic). 2026 | Secció censal | Obert (CSV) | P1 |
| Informes de l'O-HB | Distribució per trams de tinença (1, 2–4, ≥5, ≥10, ≥15, ≥50), parc total i parc de lloguer | Ciutat, AMB, demarcació | Informes, taules agregades | P1, P3, P6 |
| Fiances de l'INCASÒL | Contractes de lloguer amb renda i arrendador | Habitatge | Microdades restringides (l'O-HB hi té accés). Idescat en publica agregats per municipi i barri | P4, P6 |
| Cadastre (DG del Catastro) | Titularitat per immoble | Immoble | Dades protegides. Possible petició per a recerca | P1, P6 |
| Comptes de SOCIMIs i fons (CNMV, BME Growth) | Carteres per ciutat | Cartera | Públic | P1 (CR-N) |
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
2. **Reunir les taules de l'O-HB** per trams (ciutat 2025, lloguer 2023) i reconciliar
   els totals amb el cadastre.
3. **Top-20 propietaris** (públics, SOCIMIs, fons) amb el nombre d'habitatges a Barcelona,
   a partir de memòries i comptes. Calcular CR-N i una cota de l'HHI per a la ciutat i el
   parc de lloguer.
4. **Càlcul `L = HHI / ε`** amb un rang d'elasticitats, per a la ciutat i per barri.
   Si surt negligible fins i tot a escala de barri, ho diem i prioritzem P5 i P7.
5. Decidir si cal **demanar microdades** (fiances INCASÒL via O-HB, Cadastre) per a P4–P6.
6. Estendre a l'**AMB**.

## Lectures

Sobre Barcelona:

- García-Lamarca, M. (2021). *Real estate crisis resolution regimes and residential REITs:
  emerging socio-spatial impacts in Barcelona*. Housing Studies 36(9), 1407–1426.
  [doi:10.1080/02673037.2020.1769034](https://doi.org/10.1080/02673037.2020.1769034)
- O-HB. *Estructura i concentració de la propietat del parc de lloguer a la demarcació de
  Barcelona* (dades de gener del 2023).
- O-HB. Estudi de la propietat del parc residencial de Barcelona (dades 2025).
- Ajuntament de Barcelona: [Propietat BCN 2018](https://bcnroc.ajuntament.barcelona.cat/jspui/bitstream/11703/118864/3/Propietat-BCN-2018.pdf.txt),
  [Lab Propietat 2019–2020](https://bcnroc.ajuntament.barcelona.cat/jspui/bitstream/11703/119340/3/Lab_Propietat_2019-2020-VF.pdf.txt),
  [Lab Propietat INCASÒL (juny 2020)](https://bcnroc.ajuntament.barcelona.cat/jspui/bitstream/11703/119447/4/Lab_Propietat_Incasol_juny2020.pdf.txt).
- [Catalunya té quasi 25.500 habitatges buits en mans de grans tenidors, la meitat que el 2015](https://www.3cat.cat/3cat/catalunya-te-quasi-25-500-habitatges-buits-en-mans-de-grans-tenidors-la-meitat-que-el-2015/noticia/3343872/) (3Cat). Per a P5.

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
