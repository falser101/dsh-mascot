/**
 * Edge docking: after a drag, park the companion on the nearest screen
 * edge so it stays out of the composer and the answer column.
 */
/** Gap kept between the character box and the viewport edge. */
export declare const DOCK_MARGIN = 24;
/** Character box used for docking (matches the expanded widget). */
export declare function clampToBox(x: number, y: number, size: number, viewportWidth: number, viewportHeight: number): {
    x: number;
    y: number;
};
/**
 * Snap to the nearest edge, keeping the free axis. A drag that ends closer
 * to the left than to any other side docks left and keeps y; likewise for
 * the other three sides.
 */
export declare function dockToEdge(x: number, y: number, size: number, viewportWidth: number, viewportHeight: number, margin?: number): {
    x: number;
    y: number;
};
