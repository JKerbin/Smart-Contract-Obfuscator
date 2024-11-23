<script setup>
import * as d3 from "d3";
import { ref, onMounted, watch } from "vue";
import { useMainStore } from "../stores/mainStore";

const svgRef = ref(null);
const width = 5500;
const height = 1000;

const mainStore = useMainStore();
const jsonData = ref(null);

// JSON to tree structure
const jsonToTree = (json, name = "root") => {
    if (typeof json === "object" && json !== null) {
        return {
            name,
            children: Object.keys(json).map((key) => jsonToTree(json[key], key)),
        };
    } else {
        return { name: `${name}: ${json}` };
    }
};

// Render tree
const renderTree = () => {
    const svg = d3.select(svgRef.value);
    svg.selectAll("*").remove();

    const margin = { top: 1000, right: 1, bottom: 3000, left: 1 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const g = svg
        .append("g")
        .attr("class", "tree-group")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const treeLayout = d3.tree().size([innerHeight, innerWidth]);

    const treeData = jsonToTree(jsonData.value || {});
    const root = d3.hierarchy(treeData);

    treeLayout(root);

    // Render edges
    g.selectAll(".link")
        .data(root.links())
        .enter()
        .append("path")
        .attr("class", "link")
        .attr(
            "d",
            d3
                .linkHorizontal()
                .x((d) => d.y)
                .y((d) => d.x)
        )
        .style("fill", "none")
        .style("stroke", "#ccc")
        .style("stroke-width", "2px");

    // Render nodes
    const node = g
        .selectAll(".node")
        .data(root.descendants())
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.y},${d.x})`);

    node
        .append("circle")
        .attr("r", 5)
        .style("fill", "#539f89");

    node
        .append("text")
        .attr("dy", ".35em")
        .attr("x", (d) => (d.children ? -10 : 10))
        .style("text-anchor", (d) => (d.children ? "end" : "start"))
        .text((d) => d.data.name.slice(0, 4) + "...");
};

// Zoomming and dragging
const enableZoomAndDrag = () => {
    const svg = d3.select(svgRef.value);
    const treeGroup = svg.select(".tree-group");

    const zoom = d3.zoom().on("zoom", (event) => {
        treeGroup.attr("transform", event.transform);
    });

    svg.call(zoom);
};

// Listen to mainStore.fileContent
try {
    watch(
        () => mainStore.fileContent,
        (newContent) => {
            jsonData.value = JSON.parse(newContent); // Update JSON
            renderTree(); // Rerender
            enableZoomAndDrag(); // Rebind zoomming and dragging
        },
        { immediate: true }
    );
} catch (error) {
    console.log(error);
}


onMounted(() => {
    renderTree();
    enableZoomAndDrag();
});
</script>

<template>
    <div>
        <div class="tree-container">
            <svg ref="svgRef"></svg>
        </div>
    </div>
</template>

<style scoped>
.tree-container {
    position: absolute;
    width: 80vw;
    height: 86vh;
    overflow: hidden;
}

.tree-container svg {
    width: 100%;
    height: 100%;
    fill: var(--font-color);
}
</style>