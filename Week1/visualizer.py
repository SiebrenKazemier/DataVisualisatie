#!/usr/bin/env python
# Name: Siebren Kazemier
# Student number: 12516597
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt


# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# Open
with open(INPUT_CSV, 'r', newline='') as input_file:
    reader = csv.DictReader(input_file)

    # Append the ratings to the data_dict
    for row in reader:
        for year in range(START_YEAR, END_YEAR):
            if row['Year'] == str(year):
                data_dict[str(year)].append(float(row['Rating']))

    # Calculate average rating
    for year in range(START_YEAR, END_YEAR):
        average = sum(data_dict[str(year)]) / float(len(data_dict[str(year)]))
        data_dict[str(year)] = round(average, 1)

    # Visualizing the data
    plt.title('Line-diagram of average movie rating')
    plt.plot(data_dict.keys(), data_dict.values())
    plt.axis([0, 9, 8, 10])
    plt.ylabel('Average movie rating')
    plt.xlabel('Year')
    plt.show()

if __name__ == "__main__":
    print(data_dict)
