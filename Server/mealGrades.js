import pool from './database.js';

// Ajouter une note (ou la modifier si elle existe déjà)
export async function addOrUpdateGrade(mealId, userId, grade) {
  if (grade < 0 || grade > 5) {
    throw new Error("La note doit être comprise entre 0 et 5.");
  }

  const [existing] = await pool.query(`
    SELECT * FROM mealGrades WHERE mealId = ? AND userId = ?
  `, [mealId, userId]);

  if (existing.length > 0) {
    // Met à jour la note existante
    await pool.query(`
      UPDATE mealGrades SET grade = ? WHERE mealId = ? AND userId = ?
    `, [grade, mealId, userId]);
    return { updated: true, grade };
  } else {
    // Ajoute une nouvelle note
    await pool.query(`
      INSERT INTO mealGrades (mealId, userId, grade)
      VALUES (?, ?, ?)
    `, [mealId, userId, grade]);
    return { added: true, grade };
  }
}

// Récupérer la moyenne des notes d’un plat
export async function getAverageGrade(mealId) {
    const [result] = await pool.query(`
      SELECT AVG(grade) AS average FROM mealGrades WHERE mealId = ?
    `, [mealId]);
  
    let avg = parseFloat(result[0].average);
  
    // Vérifie si c'est un nombre valide
    if (isNaN(avg)) {
      console.log(`Erreur: la moyenne pour le plat ${mealId} n'est pas valide.`);
      return 0; // Retourne 0 si la moyenne est invalide
    }
  
    return avg;
  }

export async function getMealsRankedByGrade() {
       const [meals] = await pool.query('SELECT mealId, mealName FROM meals');
  
    // Créer un tableau avec les moyennes de chaque plat
    const mealsWithAverage = [];
  
    for (const meal of meals) {
      const averageGrade = await getAverageGrade(meal.mealId); // Récupérer la moyenne pour chaque plat
      mealsWithAverage.push({
        mealId: meal.mealId,
        mealName: meal.mealName,
        averageGrade
      });
    }
  
    // Trier le tableau par moyenne de note de manière décroissante
    mealsWithAverage.sort((a, b) => b.averageGrade - a.averageGrade);
  
    return mealsWithAverage;
  }


// Tests

async function testGrades() {
    await addOrUpdateGrade(4, "paul.emptoz@telecom-sudparis.eu", 5);
    await addOrUpdateGrade(5, "paul.emptoz@telecom-sudparis.eu", 4);
    await addOrUpdateGrade(6, "paul.emptoz@telecom-sudparis.eu", 2);

    const avg = await getAverageGrade(1);

    // Vérification de la moyenne avant d'appeler `toFixed`
    if (typeof avg === 'number' && !isNaN(avg)) {
        console.log(`🎓 Moyenne du plat 1 : ${avg.toFixed(2)}`);
    } else {
        console.log("🎓 Pas de note disponible pour le plat 1.");
    }

    const ranked = await getMealsRankedByGrade();
    console.log("📊 Classement des plats par moyenne de note :");
    ranked.forEach((meal, i) => {
      const avgGrade = typeof meal.averageGrade === 'number' && !isNaN(meal.averageGrade)
        ? meal.averageGrade.toFixed(2)
        : "Aucune note";
      console.log(`${i + 1}. ${meal.mealName} (${avgGrade})`);
    });

    process.exit();
}


testGrades();

