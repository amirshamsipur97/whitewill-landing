# The Arc Residences: project and unit data

Reference extract for the `/buy/the-arc-residences` project page and the
`/project` listing. Everything here comes from the 11 broker sheets in
`~/Desktop/inventort/arc` and is what Supabase `project_units` holds for
`project_id = 25`. No figure below is inferred.

## Project

| Field | Value |
|---|---|
| Name | The Arc Residences |
| Location | Yiti, Muscat (inside The Sustainable City Yiti) |
| Developer | SDIC |
| Area record | Yiti (`area_id` 10) |
| Units available | 27 |
| Bedrooms | 2 to 4 |
| Price range | OMR 423,883 to 2,168,938, **excluding VAT** |
| Sellable area range | 165.91 to 1,085.75 sqm |
| Price per sqm | OMR 1,746 to 3,567 |
| Handover | not stated in the sheets, so not claimed anywhere on site |
| Gallery | 4 renders in `src/assets/projects/the-arc-residences/` |

## Collections

The tower is one curved building split into three collections, held in
`project_units.subproject`.

| Collection | Units | From | To | Views recorded |
|---|---|---|---|---|
| Opal | 10 | 423,883 | 2,168,938 | Sea, Sea + Marina, Marina Waterfront |
| Oria | 10 | 807,294 | 1,891,700 | Mountain + Marina |
| Onda | 7 | 786,372 | 1,366,000 | Mountain + Marina |

## Formats

| Format | Units | From | To | Sellable sqm |
|---|---|---|---|---|
| Signature 2-Bedroom | 3 | 423,883 | 491,527 | 193.84 to 207.29 |
| Duplex 2-Bedroom | 2 | 431,279 | 445,089 | 165.91 to 177.68 |
| Signature 3-Bedroom | 4 | 786,372 | 1,004,194 | 333.50 to 372.93 |
| Signature 4-Bedroom | 4 | 888,235 | 1,066,087 | 366.58 to 403.46 |
| Duplex 3-Bedroom | 3 | 1,010,746 | 1,074,959 | 410.37 to 412.45 |
| Sky Terrace 3-Bedroom | 2 | 972,729 | 1,445,467 | 405.20 to 431.09 |
| Sky Terrace Type 1, 4-Bedroom | 2 | 1,059,486 | 1,238,853 | 490.02 to 491.05 |
| Sky Terrace Type 2, 4-Bedroom | 2 | 1,485,969 | 1,579,088 | 676.45 to 694.16 |
| Sky Garden 3-Bedroom | 2 | 1,366,000 | 1,377,922 | 699.11 to 789.06 |
| Sky Garden 4-Bedroom | 1 | 1,421,915 | 1,421,915 | 797.62 |
| Penthouse 4-Bedroom | 2 | 1,891,700 | 2,168,938 | 871.56 to 1,085.75 |

Private pools come with every Sky Garden, Sky Terrace and penthouse home. That
is recorded in `layout_type`, not in a separate column.

## Area model

Verified against every row in the sheets:

```
sellable / BUA = internal + balcony + covered terraces
total          = sellable + open-to-sky terrace
```

Stored as `internal_area_sqm` = internal, `balcony_area_sqm` = balcony plus
covered terrace, `roof_garden_sqm` = open-to-sky terrace, `total_area_sqm` =
sellable. The listing and unit pages show `total_area_sqm`, so a buyer sees the
area they are actually buying, and the open terrace shows as extra outdoor area
rather than being folded into the headline size.

## All 27 units

Sorted by price. `unit_no` is internal and never displayed.

| id | Collection | Floor | Format | Bed | View | Sellable | Open terrace | Price OMR | Per sqm |
|---|---|---|---|---|---|---|---|---|---|
| 669 | Opal | Second | Signature 2-Bed | 2 | | 193.84 | | 423,883 | 2,187 |
| 680 | Opal | First to Second | Duplex 2-Bed | 2 | | 177.68 | 18.37 | 431,279 | 2,427 |
| 670 | Opal | Fifth | Signature 2-Bed | 2 | | 195.58 | | 435,809 | 2,228 |
| 681 | Opal | First to Second | Duplex 2-Bed | 2 | | 165.91 | 101.87 | 445,089 | 2,683 |
| 671 | Opal | First | Signature 2-Bed | 2 | | 207.29 | 34.99 | 491,527 | 2,371 |
| 672 | Onda | Fourth | Signature 3-Bed | 3 | | 333.50 | | 786,372 | 2,358 |
| 673 | Oria | Third | Signature 3-Bed | 3 | | 370.64 | | 807,294 | 2,178 |
| 674 | Oria | Sixth | Signature 3-Bed | 3 | | 365.70 | | 844,708 | 2,310 |
| 676 | Onda | Seventh | Signature 4-Bed | 4 | | 366.58 | | 888,235 | 2,423 |
| 677 | Oria | Fourth | Signature 4-Bed | 4 | | 403.46 | | 914,006 | 2,265 |
| 688 | Opal | First | Sky Terrace 3-Bed | 3 | Sea | 431.09 | 74.26 | 972,729 | 2,256 |
| 675 | Oria | First | Signature 3-Bed | 3 | | 372.93 | 298.42 | 1,004,194 | 2,693 |
| 682 | Onda | Third to Fourth | Duplex 3-Bed | 3 | | 411.81 | | 1,010,746 | 2,454 |
| 678 | Onda | First | Signature 4-Bed | 4 | | 373.62 | 220.13 | 1,025,643 | 2,745 |
| 683 | Onda | Fifth to Sixth | Duplex 3-Bed | 3 | | 410.37 | | 1,026,582 | 2,502 |
| 690 | Opal | Sixth | Sky Terrace T1 4-Bed | 4 | Sea + Marina | 490.02 | | 1,059,486 | 2,162 |
| 679 | Oria | First | Signature 4-Bed | 4 | | 400.62 | 264.61 | 1,066,087 | 2,661 |
| 684 | Onda | First to Second | Duplex 3-Bed | 3 | | 412.45 | 113.70 | 1,074,959 | 2,606 |
| 691 | Oria | Fifth | Sky Terrace T1 4-Bed, pool | 4 | Mountain + Marina | 491.05 | 200.80 | 1,238,853 | 2,523 |
| 685 | Onda | Fifth | Sky Garden 3-Bed, pool | 3 | Mountain + Marina | 699.11 | | 1,366,000 | 1,954 |
| 686 | Oria | Third | Sky Garden 3-Bed, pool | 3 | Mountain + Marina | 789.06 | | 1,377,922 | 1,746 |
| 687 | Oria | Third | Sky Garden 4-Bed, pool | 4 | Mountain + Marina | 797.62 | | 1,421,915 | 1,783 |
| 689 | Opal | First | Sky Terrace 3-Bed, pool | 3 | Marina Waterfront | 405.20 | 838.98 | 1,445,467 | 3,567 |
| 692 | Opal | Third | Sky Terrace T2 4-Bed, pool | 4 | Sea + Marina | 676.45 | 178.67 | 1,485,969 | 2,197 |
| 693 | Oria | Third | Sky Terrace T2 4-Bed, pool | 4 | Mountain + Marina | 694.16 | 188.29 | 1,579,088 | 2,275 |
| 694 | Oria | Seventh | Penthouse 4-Bed, pool | 4 | Mountain + Marina | 871.56 | | 1,891,700 | 2,170 |
| 695 | Opal | Seventh | Penthouse 4-Bed, pool | 4 | Sea + Marina | 1,085.75 | | 2,168,938 | 1,998 |

## Two gaps worth knowing

**Views are missing on 15 of 27 units.** Only the Sky Garden, Sky Terrace and
penthouse sheets carried a View column; the Signature and Duplex sheets did
not. Those 15 units therefore show no view on their listing card and unit page,
which is a real weakness on a waterfront product. The recorded views suggest
Opal faces the sea and marina while Oria and Onda face mountain and marina, but
that is a pattern across 12 rows, not stated data, so nothing was written into
the database on the strength of it. Ask the developer for the view per unit and
it is a one-query fix.

**No handover date.** The sheets do not state one, so no date is claimed on the
project page or in any meta. Worth getting, since every other project on the
site shows one and its absence is visible.

## Gallery

`src/assets/projects/the-arc-residences/` holds four developer renders, 1600px
wide, JPEG q82:

1. `1.jpg` marina elevation with the rooftop pools, used as the cover and the
   project hero
2. `2.jpg` aerial of the full arc around the marina
3. `3.jpg` masterplan aerial showing the position inside The Sustainable City Yiti
4. `4.jpg` the tower seen from the water

`src/assets/thumbs/the-arc-residences/1.webp` is the 640px cover variant used
by the price index and the city landing tiles.

The listing rotates cards through the gallery with `gal[i % gal.length]`, so
the 27 unit cards cycle through all four renders instead of repeating one
cover. Verified in the browser: 27 Arc cards on `/project?area=Yiti`, 4
distinct images.
