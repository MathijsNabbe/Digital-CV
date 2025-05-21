document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".tree-nav-toggle").forEach(function (btn) {
        btn.addEventListener("click", function () {
            const categoryItem = btn.parentElement;
            const subList = categoryItem.querySelector(".tree-nav-posts");
            const isExpanded = categoryItem.classList.toggle("expanded");

            if (subList) {
                subList.style.display = isExpanded ? "block" : "none";
            }
        });
    });
});