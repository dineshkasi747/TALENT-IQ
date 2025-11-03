export const getDifficultyBadgeClass=(difficulty) => {
    switch(difficulty.toLowerCase()){
        case "easy" :
            return "badge-success"
        case "medium" :
            return "badge-warning"
        case "easy" :
            return "badge-error"
    }
}