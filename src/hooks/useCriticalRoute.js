const useCriticalRoute = () => {
  const getActividad = (cant) => {
    let letraInicial = "A";
    let codigoASCII = letraInicial.charCodeAt();
    return String.fromCharCode(codigoASCII - 1 + cant);
  };

  const activity_format = (inputForm, type) => {
    const tasks = [];
    const columns = type === "1" ? 3 : 5;
    for (let i = 1; i <= Object.keys(inputForm).length / columns; i++) {
      const name = inputForm[`actividad${i}`];
      const predecessors = inputForm[`predecesor${i}`]
        .split(",")
        .map((dep) => dep.trim().toUpperCase());

      // Predecesrores vacios
      const dependencies = predecessors.filter((dep) => dep !== "");
      if (type === "1") {
        // Add tasks
        const duration =
          inputForm[`duracion${i}`] !== ""
            ? parseInt(inputForm[`duracion${i}`])
            : 0;
        tasks.push({ name, duration, dependencies });
      } else if (type === "2") {
        const tiempoOptimista = parseInt(inputForm[`tiempoOptimista${i}`]) || 0;
        const tiempoMedio = parseInt(inputForm[`tiempoMedio${i}`]) || 0;
        const tiempoPesimista = parseInt(inputForm[`tiempoPesimista${i}`]) || 0;
        const duration = Math.round(
          (tiempoOptimista + 4 * tiempoMedio + tiempoPesimista) / 6
        );
        const variance = Math.pow((tiempoPesimista - tiempoOptimista) / 6, 2);
        tasks.push({
          name,
          duration,
          dependencies,
          variance,
          tiempoOptimista,
          tiempoMedio,
          tiempoPesimista,
        });
      }
    }
    return tasks;
  };

  const cal_pert_route = (tasks) => {
    const critical_route = cal_critical_route(tasks, "2");
    return critical_route;
  };
  const cal_critical_route = (tasks, type) => {
    // Early time
    const earlyStart = {};
    const earlyFinish = {};

    tasks.forEach((task) => {
      earlyStart[task.name] = 0;
      earlyFinish[task.name] = 0;
    });

    tasks.forEach((task) => {
      const predecessorsTime = task.dependencies.map(
        (dep) => earlyFinish[dep] || 0
      );
      earlyStart[task.name] =
        predecessorsTime.length !== 0 ? Math.max(...predecessorsTime) : 0;
      earlyFinish[task.name] = earlyStart[task.name] + task.duration;
    });

    const projectDuration = Math.max(
      ...tasks.map((task) => earlyFinish[task.name])
    );

    // Identificar actividades finales
    const usedAsPredecessor = new Set();
    tasks.forEach((task) => {
      task.dependencies.forEach((dep) => usedAsPredecessor.add(dep));
    });

    // Late Time
    const reverseTasks = tasks.slice().reverse();
    const lateStart = {};
    const lateFinish = {};

    reverseTasks.forEach((task) => {
      lateStart[task.name] = 0;
      lateFinish[task.name] = 0;
    });

    reverseTasks.forEach((task, index) => {
      if (index === 0 || !usedAsPredecessor.has(task.name)) {
        lateFinish[task.name] = projectDuration;
        lateStart[task.name] = lateFinish[task.name] - task.duration;
        return;
      }

      // Actualización para las tareas con dependencias
      const successors = tasks.filter((t) =>
        t.dependencies.includes(task.name)
      );
      lateFinish[task.name] = Math.min(
        ...successors.map((s) => lateStart[s.name])
      );
      lateStart[task.name] = lateFinish[task.name] - task.duration;
    });
    let results = null;
    let totalVariance = 0;
    if (type === "1") {
      results = tasks.map((task) => {
        return {
          name: task.name,
          duration: task.duration,
          dependencies: task.dependencies,
          earlyStart: earlyStart[task.name],
          earlyFinish: earlyFinish[task.name],
          lateStart: lateStart[task.name],
          lateFinish: lateFinish[task.name],
          stack: lateFinish[task.name] - earlyFinish[task.name],
          isCriticalPath: earlyFinish[task.name] === lateFinish[task.name],
        };
      });
    } else if (type === "2") {
      results = tasks.map((task) => {
        const variance = parseFloat(task.variance.toFixed(4));
        totalVariance += variance;
        return {
          name: task.name,
          duration: task.duration,
          dependencies: task.dependencies,
          earlyStart: earlyStart[task.name],
          earlyFinish: earlyFinish[task.name],
          lateStart: lateStart[task.name],
          lateFinish: lateFinish[task.name],
          stack: lateFinish[task.name] - earlyFinish[task.name],
          isCriticalPath: earlyFinish[task.name] === lateFinish[task.name],
          variance: variance,
        };
      });
    }
    const totalStandardDeviation = Math.sqrt(totalVariance).toFixed(4);
    results.totalStandardDeviation = parseFloat(totalStandardDeviation);

    return results;
  };

  const generate_diagram = (tasks) => {
    let dotGraph = `digraph G {
      rankdir=LR;
      node [style="filled"];
    \n`;

    dotGraph += `  Ini [shape=circle, label="Ini", style="filled", fillcolor="lightblue"];\n`;
    dotGraph += `  Fin [shape=circle, label="Fin", style="filled", fillcolor="lightblue"];\n`;

    tasks.forEach((task) => {
      const nodeStyle = task.isCriticalPath ? 'fillcolor="#e35252"' : "";
      dotGraph += `  ${task.name} [label="${task.name}\\n(${task.duration})", ${nodeStyle}];\n`;

      if (!task.dependencies || task.dependencies.length === 0) {
        dotGraph += `  Ini -> ${task.name};\n`;
      }

      task.dependencies.forEach((dep) => {
        dotGraph += `  ${dep} -> ${task.name};\n`;
      });
    });

    const allTasks = tasks.map((task) => task.name);
    const tasksWithDependencies = new Set(
      tasks.flatMap((task) => task.dependencies || [])
    );
    const tasksWithoutSuccessors = allTasks.filter(
      (task) => !tasksWithDependencies.has(task)
    );

    tasksWithoutSuccessors.forEach((task) => {
      dotGraph += `  ${task} -> Fin;\n`;
    });

    dotGraph += "}";
    return dotGraph;
  };

  return {
    getActividad,
    activity_format,
    cal_critical_route,
    generate_diagram,
    cal_pert_route,
  };
};

export default useCriticalRoute;
