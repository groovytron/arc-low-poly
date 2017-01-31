---
title: HE-Arc Low Poly
author:
    - Julien M'Poy
    - Joël Vaucher
date: 31 Janvier 2017
---

## He-Arc Low Poly

dépôt git: [https://github.com/groovytron/arc-low-poly](https://github.com/groovytron/arc-low-poly)

---

## Sommaire

* Objectifs du projet
* Logiciels utilisés
* Problèmes rencontrés
* Solution finale
* Atteinte des objectifs et améliorations possibles
* Démonstration
* Questions

---

## Objectifs du projet

* Modéliser une table en billboards.
* L'exporter au format _.obj_.
* Afficher le modèle dans une page web.
* Proposer un minimum d'interaction avec la table (rotation, translation, ...).
* Affichage de plusieurs tables dans une salle de classe (__secondaire__).
* Modéliser un deuxième meuble (__secondaire__).

---

## Logiciels utilisés

* Modélisation: [Blender](https://www.blender.org/)
* Rendu: [WebGL](https://www.khronos.org/webgl/)
* Chargement du modèle dans WebGL: bibliothèque
  [webgl-obj-loader](https://github.com/frenchtoast747/webgl-obj-loader)
  d'Aaron Boman.

---

## Problèmes rencontrés

* Modélisation de la table en billboards.
* Pose des textures sur les bonnes faces du modèle.
  (~~[obj-mtl-loader](https://github.com/tiansijie/ObjLoader)~~)

<aside class="notes">
    * Comprendre en profondeur comment créer un billboard à partir d'un modèle
      détaillé.
    * La modélisation a pris du temps.
    * obj-mtl-loader: compilation avec Webpack pour une utilisation côté client.
    * Comment poser les textures sur les bonnes faces?
      --> Utiliser une texture unique
      --> webgl-obj-loader suffit pour ce cas
</aside>

---

## Solution finale

* Billboard modélisé avec Blender (prises sous différents plans)
* Chargement du fichier _.obj_ avec _webgl-obj-loader_.
* Chargement d'une texture unique (facilite la gestion dans les shaders)

<aside class="notes">
    * Parallélipipède rectangle sur lequel on pose des coupes sur
      chacune de ses faces.
    * Une texture --> un sampler2d côté shader.
    * On a tout ce qui nous faut avec webgl-obj-loader (vertices,
      indices, normales, coordonnées de textures, etc.)
</aside>

---

## Atteinte des objectifs

* Table modélisée en billboards.
* Modèle chargé dans WebGL (illumination locale avec l'[algorithme de Lambert](https://fr.wikipedia.org/wiki/Ombrage_plat))
* Possibilité d'interaction (rotation et translation)

---

## Améliorations possibles

* Afficher plus de tables.
* Rendu d'une salle.
* Modéliser des chaises.

---

## Démonstration

[Application hébergée chez GitHub](https://groovytron.github.io/arc-low-poly/)

---

## Questions?
