#!/usr/bin/env Rscript

source("lib/header.R");
dep("data.table", "rpart", "rpart.plot");

data <- fread("data/sef.csv");
data[, time := as.POSIXct(time)]

data$stage = factor("other")
data["2015-05-07 22:24:00 UTC" <= time & time <= "2015-05-07 22:49:00 UTC", stage := factor("rem")]
data["2015-05-08 01:23:00 UTC" <= time & time <= "2015-05-08 01:54:00 UTC", stage := factor("rem")]
data["2015-05-08 02:56:00 UTC" <= time & time <= "2015-05-08 02:58:00 UTC", stage := factor("rem")]
data["2015-05-08 02:59:00 UTC" <= time & time <= "2015-05-08 03:09:00 UTC", stage := factor("rem")]

formula = stage ~ sefd + absolutePower + relativePower
tree = rpart(formula, data = data, method = "class", control = rpart.control(maxdepth = 3))
print(tree)
prp(tree, extra=1)
