Sys.setenv(TZ='GMT')

dep <- function(...) {
  for (package in list(...)) {
    if (!package %in% installed.packages()) {
      install.packages(package);
    }
    library(package, character.only=TRUE);
  }
}
