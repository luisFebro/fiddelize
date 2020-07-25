import React from 'react';
import { default as MuSkeleton } from '@material-ui/lab/Skeleton';
import { makeStyles } from "@material-ui/core/styles";
import { IS_DEV } from '../../config/clientUrl';

const useStyles = makeStyles(theme => ({
  avatarSkeletonContainer: {
    height: 0,
    overflow: "hidden",
    paddingTop: "40%",
    position: "relative",
    margin: '15px 0',
  },
  avatarLoader: {
    position: "absolute",
    borderRadius: '4px 4px 4px 4px',
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: 'grey',
    animation: IS_DEV ? false : "MuiSkeleton-keyframes-animate 1.5s ease-in-out infinite",
  },
  leftText: {
    marginLeft: 150,
    backgroundColor: 'grey',
  },
}))

const getStyles = () => ({
    root: {
        textAlign: "center",
        height: "100%",
        width: "100%"
    },
})

const { skeletonRoot } = getStyles();
export { skeletonRoot };

export default function Skeleton({
    variant = "rect",
    width,
    height = 135,
    needLeftText = false,
}) {
    const classes = useStyles();

    return (
        <div className={classes.avatarSkeletonContainer}>
            <MuSkeleton
                variant={variant}
                width={width}
                height={height}
                className={classes.avatarLoader}
            />
            {needLeftText && (
                <MuSkeleton
                    variant="text"
                    width={200}
                    height={40}
                    className={classes.leftText}
                />
            )}
        </div>
    );
}