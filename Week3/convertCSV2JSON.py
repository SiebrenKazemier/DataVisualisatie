<<<<<<< HEAD
###############################################################################
# Name: Siebren Kazemier
# School: Uva
# Project: Assignment week 3, Converting CSV file to JSON
###############################################################################

import pandas as pd


def main(input_file, output_file):

    csv_file = read_csv(input_file)
    json_file = write_json(csv_file, output_file)


def read_csv(input_file):
    csv_file = pd.read_csv(input_file)
    return csv_file


def write_json(csv_file, output_file):
    json_file = csv_file.to_json(path_or_buf=output_file, orient="index")
    return json_file


if __name__ == "__main__":
    main("temperatuur.csv", "data.json")
=======
###############################################################################
# Name: Siebren Kazemier
# School: Uva
# Project: Assignment week 3, Converting CSV file to JSON
###############################################################################

import pandas as pd


def main(input_file, output_file):

    csv_file = read_csv(input_file)
    json_file = write_json(csv_file, output_file)


def read_csv(input_file):
    csv_file = pd.read_csv(input_file)
    return csv_file


def write_json(csv_file, output_file):
    json_file = csv_file.to_json(path_or_buf=output_file)
    return json_file


if __name__ == "__main__":
    main("temperatuur.csv", "data.json")
>>>>>>> f1f2d0d2d7b33662f6d6ee0c5aab566f1d980fa6
